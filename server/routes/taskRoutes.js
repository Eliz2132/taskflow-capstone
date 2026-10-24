const express = require('express');
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
