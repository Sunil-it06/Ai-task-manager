"""
worker.py

Main entry point for the Python background worker.

Workflow (matches assignment spec):
1. Blocks on Redis list "ai-tasks-queue" waiting for a job (BRPOP)
2. Parses the JSON payload to get the taskId
3. Fetches the task from MongoDB
4. Sets status -> "Running"
5. Executes the requested operation
6. Saves result + logs, sets status -> "Success" or "Failed"

Run multiple instances of this process to scale worker throughput
(see Kubernetes Deployment "replicas" for worker scaling).
"""

import json
import logging
import os
import time
from datetime import datetime, timezone

import redis
from dotenv import load_dotenv

from db import get_task, update_task_status, save_task_result
from operations import run_operation, UnsupportedOperationError

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [worker] %(levelname)s: %(message)s",
)
logger = logging.getLogger(__name__)

QUEUE_KEY = "ai-tasks-queue"
BLOCK_TIMEOUT_SECONDS = 5  # so the loop can check for shutdown signals periodically


def get_redis_client():
    redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379")
    return redis.from_url(redis_url, decode_responses=True)


def process_task(task_id: str):
    task = get_task(task_id)
    if not task:
        logger.error("Task %s not found in database, skipping", task_id)
        return

    logger.info("Processing task %s (operation=%s)", task_id, task.get("operationType"))

    # Step: mark as Running
    update_task_status(
        task_id,
        "Running",
        extra_log=f"[{datetime.now(timezone.utc).isoformat()}] Worker picked up task, status -> Running",
    )

    try:
        result = run_operation(task["operationType"], task["inputText"])
        save_task_result(
            task_id,
            status="Success",
            result=result,
            extra_log=f"[{datetime.now(timezone.utc).isoformat()}] Operation completed successfully",
        )
        logger.info("Task %s completed successfully", task_id)

    except UnsupportedOperationError as exc:
        save_task_result(
            task_id,
            status="Failed",
            result=None,
            extra_log=f"[{datetime.now(timezone.utc).isoformat()}] Failed: {exc}",
        )
        logger.error("Task %s failed: %s", task_id, exc)

    except Exception as exc:  # noqa: BLE001 - we want to catch all and mark task Failed
        save_task_result(
            task_id,
            status="Failed",
            result=None,
            extra_log=f"[{datetime.now(timezone.utc).isoformat()}] Unexpected error: {exc}",
        )
        logger.exception("Unexpected error processing task %s", task_id)


def main():
    logger.info("Worker starting up, connecting to Redis...")
    client = get_redis_client()
    logger.info("Worker connected. Listening on queue '%s'", QUEUE_KEY)

    while True:
        try:
            item = client.brpop(QUEUE_KEY, timeout=BLOCK_TIMEOUT_SECONDS)
            if item is None:
                # No job within timeout window - loop again (keeps process responsive)
                continue

            _, payload_raw = item
            payload = json.loads(payload_raw)
            task_id = payload.get("taskId")

            if not task_id:
                logger.warning("Received payload without taskId: %s", payload_raw)
                continue

            process_task(task_id)

        except redis.exceptions.ConnectionError as exc:
            logger.error("Redis connection error: %s. Retrying in 3s...", exc)
            time.sleep(3)

        except Exception:  # noqa: BLE001 - keep the worker alive on unexpected errors
            logger.exception("Unexpected error in main loop, continuing...")
            time.sleep(1)


if __name__ == "__main__":
    main()