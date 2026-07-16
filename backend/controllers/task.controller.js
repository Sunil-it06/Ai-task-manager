const Task = require('../models/task.model');
const { OPERATION_TYPES } = require('../models/task.model');
const { enqueueTask } = require('../queue/taskQueue');

async function createTask(req, res, next) {
  try {
    const { title, inputText, operationType } = req.body;

    if (!title || !inputText || !operationType) {
      return res.status(400).json({ message: 'title, inputText and operationType are required' });
    }

    if (!OPERATION_TYPES.includes(operationType)) {
      return res.status(400).json({
        message: `operationType must be one of: ${OPERATION_TYPES.join(', ')}`,
      });
    }

    const task = await Task.create({
      userId: req.user.id,
      title,
      inputText,
      operationType,
      status: 'Pending',
    });

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

// Step: user clicks "Run Task" -> push task onto Redis queue for worker
async function runTask(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.status === 'Running') {
      return res.status(409).json({ message: 'Task is already running' });
    }

    task.status = 'Pending';
    task.logs.push(`[${new Date().toISOString()}] Task queued for processing`);
    await task.save();

    await enqueueTask(task._id.toString());

    res.status(200).json({ message: 'Task queued for execution', task });
  } catch (err) {
    next(err);
  }
}

async function getTasks(req, res, next) {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
}

module.exports = { createTask, runTask, getTasks, getTaskById };