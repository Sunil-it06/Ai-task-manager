const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createTask,
  runTask,
  getTasks,
  getTaskById,
} = require('../controllers/task.controller');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/:id/run', runTask);

module.exports = router;