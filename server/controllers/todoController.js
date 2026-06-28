const Todo = require('../models/Todo');

/**
 * @desc    Get all todos with search, filter, and sort support
 * @route   GET /api/todos
 * @access  Public
 */
const getTodos = async (req, res, next) => {
  try {
    const { search, priority, status, sort } = req.query;

    // Build the query filter object
    const filter = {};

    // Search by title or description (case-insensitive regex)
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    // Filter by priority
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      filter.priority = priority;
    }

    // Filter by status
    if (status && ['Pending', 'Completed'].includes(status)) {
      filter.status = status;
    }

    // Build the sort object
    let sortOption = { createdAt: -1 }; // Default: newest first

    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'dueDate') {
      sortOption = { dueDate: 1 };
    } else if (sort === 'priority') {
      // High > Medium > Low using a custom sort order
      // We use a computed field approach by chaining sort stages — use aggregation for priority sort
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      const todos = await Todo.find(filter).lean();
      todos.sort((a, b) => (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99));
      return res.status(200).json({ success: true, count: todos.length, data: todos });
    }

    const todos = await Todo.find(filter).sort(sortOption).lean();

    res.status(200).json({ success: true, count: todos.length, data: todos });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single todo by ID
 * @route   GET /api/todos/:id
 * @access  Public
 */
const getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id).lean();

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new todo
 * @route   POST /api/todos
 * @access  Public
 */
const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const todo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate: dueDate || null,
    });

    res.status(201).json({ success: true, message: 'Todo created successfully', data: todo });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a todo by ID
 * @route   PUT /api/todos/:id
 * @access  Public
 */
const updateTodo = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = dueDate || null;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.status(200).json({ success: true, message: 'Todo updated successfully', data: todo });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a todo by ID
 * @route   DELETE /api/todos/:id
 * @access  Public
 */
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id).lean();

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    res.status(200).json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle todo status between Pending and Completed
 * @route   PATCH /api/todos/:id/status
 * @access  Public
 */
const toggleTodoStatus = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    // Toggle the status
    todo.status = todo.status === 'Pending' ? 'Completed' : 'Pending';
    await todo.save();

    res.status(200).json({
      success: true,
      message: `Todo marked as ${todo.status}`,
      data: todo.toObject(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
};
