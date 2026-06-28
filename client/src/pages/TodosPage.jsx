import { useState, useCallback } from 'react';
import {
  FiSearch, FiFilter, FiPlusCircle, FiRefreshCw, FiX,
} from 'react-icons/fi';
import TodoCard from '../components/TodoCard';
import { TodoFormModal, ConfirmDialog } from '../components/Dialogs';
import ToastContainer, { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import useTodos from '../hooks/useTodos';

/**
 * Skeleton card shown during loading state.
 */
const SkeletonCard = () => (
  <div className="card p-5 animate-pulse">
    <div className="flex gap-2 mb-4">
      <div className="h-5 w-16 bg-slate-100 rounded-full" />
      <div className="h-5 w-20 bg-slate-100 rounded-full" />
    </div>
    <div className="h-4 w-3/4 bg-slate-100 rounded mb-2" />
    <div className="h-3 w-full bg-slate-100 rounded mb-1" />
    <div className="h-3 w-2/3 bg-slate-100 rounded mb-4" />
    <div className="h-3 w-28 bg-slate-100 rounded mb-4" />
    <div className="border-t border-slate-100 pt-4 flex gap-2">
      <div className="h-7 w-14 bg-slate-100 rounded-lg" />
      <div className="h-7 w-14 bg-slate-100 rounded-lg" />
      <div className="h-7 w-20 bg-slate-100 rounded-lg" />
      <div className="h-7 w-16 bg-slate-100 rounded-lg ml-auto" />
    </div>
  </div>
);

/**
 * TodosPage - Main dashboard page at route /todos
 * Displays all todos with search, filter, sort, and CRUD capabilities.
 */
const TodosPage = () => {
  const { todos, loading, error, filters, updateFilter, loadTodos, addTodo, editTodo, removeTodo, toggleStatus } = useTodos();
  const { toasts, addToast, removeToast } = useToast();

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deletingTodo, setDeletingTodo] = useState(null);

  // Loading states for individual actions
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleOpenAdd = useCallback(() => {
    setEditingTodo(null);
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((todo) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTodo(null);
  }, []);

  const handleFormSubmit = useCallback(async (data) => {
    setFormLoading(true);
    try {
      if (editingTodo) {
        await editTodo(editingTodo._id, data);
        addToast('Todo updated successfully!', 'success');
      } else {
        await addTodo(data);
        addToast('Todo created successfully!', 'success');
      }
      handleCloseForm();
    } catch (err) {
      addToast(err.message || 'Failed to save todo.', 'error');
    } finally {
      setFormLoading(false);
    }
  }, [editingTodo, editTodo, addTodo, addToast, handleCloseForm]);

  const handleDeleteRequest = useCallback((todo) => {
    setDeletingTodo(todo);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingTodo) return;
    setDeleteLoading(true);
    try {
      await removeTodo(deletingTodo._id);
      addToast('Todo deleted successfully.', 'success');
      setDeletingTodo(null);
    } catch (err) {
      addToast(err.message || 'Failed to delete todo.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  }, [deletingTodo, removeTodo, addToast]);

  const handleToggleStatus = useCallback(async (id) => {
    setToggleLoadingId(id);
    try {
      const updated = await toggleStatus(id);
      addToast(`Marked as ${updated.status}!`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update status.', 'error');
    } finally {
      setToggleLoadingId(null);
    }
  }, [toggleStatus, addToast]);

  const handleClearFilters = useCallback(() => {
    updateFilter('search', '');
    updateFilter('priority', '');
    updateFilter('status', '');
    updateFilter('sort', 'newest');
  }, [updateFilter]);

  const hasActiveFilters =
    filters.search || filters.priority || filters.status || filters.sort !== 'newest';

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-1">My Todos</h1>
              <p className="text-indigo-200 text-sm font-medium">
                {loading
                  ? 'Loading your todos...'
                  : `${todos.length} todo${todos.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
            <button
              id="hero-add-todo-btn"
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-bold text-sm rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 self-start sm:self-auto"
            >
              <FiPlusCircle className="text-lg" />
              Add Todo
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="sticky top-[64px] z-30 bg-white/90 backdrop-blur-sm border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
              <input
                id="search-input"
                type="search"
                placeholder="Search todos..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="form-input pl-9 py-2 text-sm"
                aria-label="Search todos"
              />
            </div>

            {/* Priority Filter */}
            <select
              id="priority-filter"
              value={filters.priority}
              onChange={(e) => updateFilter('priority', e.target.value)}
              className="form-input py-2 text-sm w-auto cursor-pointer"
              aria-label="Filter by priority"
            >
              <option value="">All Priorities</option>
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>

            {/* Status Filter */}
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="form-input py-2 text-sm w-auto cursor-pointer"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Completed">✅ Completed</option>
            </select>

            {/* Sort */}
            <select
              id="sort-select"
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="form-input py-2 text-sm w-auto cursor-pointer"
              aria-label="Sort todos"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueDate">By Due Date</option>
              <option value="priority">By Priority</option>
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                id="clear-filters-btn"
                onClick={handleClearFilters}
                className="btn-ghost text-slate-400 hover:text-red-500 hover:bg-red-50 text-xs"
                title="Clear all filters"
              >
                <FiX />
                Clear
              </button>
            )}

            {/* Refresh */}
            <button
              id="refresh-btn"
              onClick={loadTodos}
              disabled={loading}
              className="btn-ghost text-slate-400 hover:text-indigo-500 hover:bg-indigo-50"
              title="Refresh"
              aria-label="Refresh todos"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global API error */}
        {error && !loading && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <span className="text-red-500">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-700">Failed to load todos</p>
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            </div>
            <button
              onClick={loadTodos}
              className="ml-auto text-sm font-semibold text-red-600 hover:text-red-700 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && todos.length === 0 && (
          <EmptyState
            title={hasActiveFilters ? 'No matching todos' : 'No todos yet!'}
            subtitle={
              hasActiveFilters
                ? 'Try adjusting your search or filters.'
                : 'Click "Add Todo" to create your first task.'
            }
            action={
              hasActiveFilters ? (
                <button onClick={handleClearFilters} className="btn-secondary">
                  <FiX /> Clear Filters
                </button>
              ) : (
                <button onClick={handleOpenAdd} className="btn-primary">
                  <FiPlusCircle /> Create First Todo
                </button>
              )
            }
          />
        )}

        {/* Todos Grid */}
        {!loading && todos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {todos.map((todo) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteRequest}
                onToggleStatus={handleToggleStatus}
                isActionLoading={toggleLoadingId === todo._id}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <TodoFormModal
        isOpen={isFormOpen}
        todo={editingTodo}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        isLoading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTodo}
        title="Delete this todo?"
        message={`Are you sure you want to delete "${deletingTodo?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingTodo(null)}
        isLoading={deleteLoading}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default TodosPage;
