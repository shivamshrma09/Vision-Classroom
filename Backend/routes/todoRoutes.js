const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controllers/todoController');

// All routes require authentication
router.use(authMiddleware);

// GET /api/todos - Get todos for a specific date
router.get('/', getTodos);

// POST /api/todos - Create a new todo
router.post('/', createTodo);

// PUT /api/todos/:id - Update a todo
router.put('/:id', updateTodo);

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', deleteTodo);

module.exports = router;