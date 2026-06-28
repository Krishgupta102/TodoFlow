const express = require('express');
const router = express.Router();

const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
} = require('../controllers/todoController');

const { validateCreateTodo, validateUpdateTodo } = require('../middlewares/validator');

// GET /api/todos         - Get all todos (supports ?search, ?priority, ?status, ?sort)
// POST /api/todos        - Create a new todo
router.route('/').get(getTodos).post(validateCreateTodo, createTodo);

// GET /api/todos/:id     - Get single todo
// PUT /api/todos/:id     - Update todo
// DELETE /api/todos/:id  - Delete todo
router.route('/:id').get(getTodoById).put(validateUpdateTodo, updateTodo).delete(deleteTodo);

// PATCH /api/todos/:id/status - Toggle Pending/Completed
router.patch('/:id/status', toggleTodoStatus);

module.exports = router;
