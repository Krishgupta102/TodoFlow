import { useState, useCallback, useEffect, useRef } from 'react';
import * as todoService from '../services/todoService';

/**
 * Custom hook for managing todos state, filters, and API calls.
 * Encapsulates all todo-related logic away from page components.
 *
 * @returns {Object} - todos, loading, error, filters, and action handlers
 */
const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    status: '',
    sort: 'newest',
  });

  // Debounce ref for search
  const searchDebounceRef = useRef(null);

  /**
   * Fetches todos from the backend with current filters applied.
   */
  const loadTodos = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.priority) params.priority = currentFilters.priority;
      if (currentFilters.status) params.status = currentFilters.status;
      if (currentFilters.sort && currentFilters.sort !== 'newest') params.sort = currentFilters.sort;

      const response = await todoService.fetchTodos(params);
      setTodos(response.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload when filters change
  useEffect(() => {
    loadTodos(filters);
  }, [filters.priority, filters.status, filters.sort, loadTodos]);

  /**
   * Updates a filter key with debouncing for search.
   */
  const updateFilter = useCallback((key, value) => {
    if (key === 'search') {
      // Debounce search input by 400ms
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      setFilters((prev) => ({ ...prev, search: value }));
      searchDebounceRef.current = setTimeout(() => {
        setFilters((prev) => {
          loadTodos({ ...prev, search: value });
          return prev;
        });
      }, 400);
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  }, [loadTodos]);

  /**
   * Creates a new todo and reloads the list.
   */
  const addTodo = useCallback(async (data) => {
    const response = await todoService.createTodo(data);
    await loadTodos(filters);
    return response.data.data;
  }, [filters, loadTodos]);

  /**
   * Updates an existing todo and reloads the list.
   */
  const editTodo = useCallback(async (id, data) => {
    const response = await todoService.updateTodo(id, data);
    await loadTodos(filters);
    return response.data.data;
  }, [filters, loadTodos]);

  /**
   * Deletes a todo and reloads the list.
   */
  const removeTodo = useCallback(async (id) => {
    await todoService.deleteTodo(id);
    await loadTodos(filters);
  }, [filters, loadTodos]);

  /**
   * Toggles todo status and updates it in the local state.
   */
  const toggleStatus = useCallback(async (id) => {
    const response = await todoService.toggleTodoStatus(id);
    const updatedTodo = response.data.data;
    setTodos((prev) =>
      prev.map((todo) => (todo._id === id ? updatedTodo : todo))
    );
    return updatedTodo;
  }, []);

  return {
    todos,
    loading,
    error,
    filters,
    updateFilter,
    loadTodos: () => loadTodos(filters),
    addTodo,
    editTodo,
    removeTodo,
    toggleStatus,
  };
};

export default useTodos;
