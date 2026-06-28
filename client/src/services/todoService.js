import api from './api';

/**
 * All backend API calls for Todo resources.
 * Uses the shared Axios instance from api.js.
 */

/**
 * Fetch all todos with optional filtering, searching, and sorting.
 * @param {Object} params - { search, priority, status, sort }
 */
export const fetchTodos = (params = {}) =>
  api.get('/todos', { params });

/**
 * Fetch a single todo by its MongoDB ID.
 * @param {string} id - Todo ObjectId
 */
export const fetchTodoById = (id) =>
  api.get(`/todos/${id}`);

/**
 * Create a new todo.
 * @param {Object} data - { title, description, priority, status, dueDate }
 */
export const createTodo = (data) =>
  api.post('/todos', data);

/**
 * Update an existing todo by ID.
 * @param {string} id - Todo ObjectId
 * @param {Object} data - Fields to update
 */
export const updateTodo = (id, data) =>
  api.put(`/todos/${id}`, data);

/**
 * Delete a todo by ID.
 * @param {string} id - Todo ObjectId
 */
export const deleteTodo = (id) =>
  api.delete(`/todos/${id}`);

/**
 * Toggle todo status between Pending and Completed.
 * @param {string} id - Todo ObjectId
 */
export const toggleTodoStatus = (id) =>
  api.patch(`/todos/${id}/status`);
