/**
 * Request body validation middleware for Todo creation and updates.
 * Checks that required fields are present and values are within allowed enums.
 */

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Pending', 'Completed'];

/**
 * Validates the request body when creating a new Todo.
 */
const validateCreateTodo = (req, res, next) => {
  const { title, priority, status } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Title is required and cannot be empty.' });
  }

  if (title.trim().length > 200) {
    return res.status(400).json({ success: false, message: 'Title cannot exceed 200 characters.' });
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
    });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  next();
};

/**
 * Validates the request body when updating a Todo.
 * Title is optional on update but must not be empty if provided.
 */
const validateUpdateTodo = (req, res, next) => {
  const { title, priority, status } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Title cannot be empty.' });
    }
    if (title.trim().length > 200) {
      return res.status(400).json({ success: false, message: 'Title cannot exceed 200 characters.' });
    }
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
    });
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  next();
};

module.exports = { validateCreateTodo, validateUpdateTodo };
