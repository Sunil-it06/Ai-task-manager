"""
worker.py

Listens to the Redis queue, pulls tasks, executes them via operations.py,
and updates the status/results back into MongoDB via db.py.
"""

import json
import logging
import os
import time
from redis import Redis
from db import get_task, save_task_result, update_task_status
from operations import UnsupportedOperationError, run_operation

# Setup simple logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s"
)
logger = logging.getLogger("worker")


def main():
    logger.info("Worker starting up, connecting to Redis...")

    redis_url = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
    redis_client = Redis.from_url(redis_url)
    queue_name = os.environ.get("QUEUE_NAME", "ai-tasks-queue")

    logger.info("Worker connected. Listening on queue '%s'", queue_name)

    while True:
        try:
            # Block waiting for an item from the queue
            task_data_raw = redis_client.blpop(queue_name, timeout=5)
            if not task_data_raw:
                continue

            # blpop returns a tuple: (queue_name, bytes_data)
            _, data_bytes = task_data_raw
            task_payload = json.loads(data_bytes.decode("utf-8"))
            task_id = task_payload.get("taskId")

            if not task_id:
                logger.warning("Received payload missing 'taskId'. Skipping.")
                continue

            process_task(task_id)

        except Exception as e:
            logger.error("Error occurred in main worker loop: %s", e)
            time.sleep(2)


def process_task(task_id: str):
    logger.info("Processing task ID: %s", task_id)

    task = get_task(task_id)
    if not task:
        logger.error("Task ID %s not found in MongoDB records.", task_id)
        return

    operation = task.get("operation")
    input_text = task.get("inputText", "")

    log_msg = f"Worker picked up task execution at {time.time()}"
    update_task_status(task_id, "processing", log_msg)

    try:
        # Process the operation logic cleanly
        result = run_operation(operation, input_text)

        save_task_result(
            task_id=task_id,
            status="completed",
            result=result,
            extra_log=f"Task completed. Result length: {len(result)}"
        )
        logger.info("Successfully completed task execution for ID: %s", task_id)

    except UnsupportedOperationError as err:
        error_msg = f"Operation failed due to unsupported type: {err}"
        logger.error(error_msg)
        update_task_status(task_id, "failed", error_msg)

    except Exception as err:
        error_msg = f"Runtime execution failed due to an exception: {err}"
        logger.error(error_msg)
        update_task_status(task_id, "failed", error_msg)

    if __name__ == "__main__":
        main()
