"""
db.py

Handles MongoDB connection and task read/update operations.
Uses the same database/collection that the Node.js backend (Mongoose) writes to.
Mongoose's default collection name for a "Task" model is "tasks" (pluralized, lowercase).
"""

import os
from datetime import datetime, timezone
from bson import ObjectId
from pymongo import MongoClient

_client = None
_db = None


def get_db():
    global _client, _db
    if _db is None:
        default_uri = (
            "mongodb+srv://sunilguptait06:Sunil%40mern1@cluster0.stuqq5m"
            ".mongodb.net/ai-task-manager?retryWrites=true&w=majority"
            "&appName=Cluster0"
        )
        mongo_uri = os.environ.get("MONGO_URI", default_uri)
        _client = MongoClient(mongo_uri)
        # Database name is taken from the URI itself
        _db = _client.get_default_database()
    return _db


def get_task(task_id: str):
    db = get_db()
    return db.tasks.find_one({"_id": ObjectId(task_id)})


def update_task_status(task_id: str, status: str, extra_log: str | None = None):
    db = get_db()
    update = {"$set": {"status": status, "updatedAt": datetime.now(timezone.utc)}}
    if extra_log:
        update["$push"] = {"logs": extra_log}
    db.tasks.update_one({"_id": ObjectId(task_id)}, update)


def save_task_result(task_id: str, status: str, result: str, extra_log: str):
    db = get_db()
    db.tasks.update_one(
        {"_id": ObjectId(task_id)},
        {
            "$set": {
                "status": status,
                "result": result,
                "updatedAt": datetime.now(timezone.utc),
            },
            "$push": {"logs": extra_log},
        },
    )
