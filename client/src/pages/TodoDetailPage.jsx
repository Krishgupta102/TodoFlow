import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiCalendar, FiClock, FiEdit2, FiTrash2,
  FiCheckCircle, FiAlertTriangle,
} from 'react-icons/fi';
import { fetchTodoById } from '../services/todoService';
import { TodoFormModal, ConfirmDialog } from '../components/Dialogs';
import ToastContainer, { useToast } from '../components/Toast';
import Spinner from '../components/Spinner';
import { formatDate, formatDateTime, getPriorityStyles, getStatusStyles, isOverdue } from '../utils/helpers';
import * as todoService from '../services/todoService';

/**
 * Info row component for the detail view.
 */
const DetailRow = ({ icon, label, value, className = '' }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm font-medium text-slate-800 ${className}`}>{value}</p>
    </div>
  </div>
);

/**
 * TodoDetailPage - Displays complete information about a single todo.
 * Route: /todo?id=<todoId>
 *
 * Reads the todo ID from URL query parameters using useSearchParams.
 */
const TodoDetailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  // Fetch the todo on mount
  useEffect(() => {
    if (!id) {
      setError('No todo ID provided in the URL.');
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchTodoById(id);
        setTodo(response.data.data);
      } catch (err) {
        setError(err.message || 'Failed to load todo.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleEdit = async (data) => {
    setActionLoading(true);
    try {
      const response = await todoService.updateTodo(id, data);
      setTodo(response.data.data);
      addToast('Todo updated successfully!', 'success');
      setIsEditOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to update todo.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await todoService.deleteTodo(id);
      addToast('Todo deleted.', 'success');
      setTimeout(() => navigate('/todos'), 800);
    } catch (err) {
      addToast(err.message || 'Failed to delete todo.', 'error');
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    setActionLoading(true);
    try {
      const response = await todoService.toggleTodoStatus(id);
      setTodo(response.data.data);
      addToast(`Marked as ${response.data.data.status}!`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to toggle status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ─── States ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Spinner size="lg" label="Loading todo..." />
      </div>
    );
  }

  if (error || !todo) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 p-6">
        <div className="w-16 h-16 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center text-3xl">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-slate-700">Todo Not Found</h2>
        <p className="text-sm text-slate-400 text-center max-w-xs">{error || 'The requested todo could not be found.'}</p>
        <button onClick={() => navigate('/todos')} className="btn-primary mt-2">
          <FiArrowLeft /> Back to Todos
        </button>
      </div>
    );
  }

  const priorityStyles = getPriorityStyles(todo.priority);
  const statusStyles = getStatusStyles(todo.status);
  const overdue = isOverdue(todo.dueDate) && todo.status === 'Pending';
  const isCompleted = todo.status === 'Completed';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <button
            id="back-to-todos-btn"
            onClick={() => navigate('/todos')}
            className="btn-ghost text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 -ml-2"
          >
            <FiArrowLeft className="text-base" />
            Back to Todos
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`badge ${priorityStyles.badge} bg-white/20 text-white border-white/30`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-white`} />
              {todo.priority} Priority
            </span>
            <span className={`badge ${statusStyles.badge} bg-white/20 text-white border-white/30`}>
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              {todo.status}
            </span>
            {overdue && (
              <span className="badge bg-red-400/80 text-white border-red-300/50">
                <FiAlertTriangle />
                Overdue
              </span>
            )}
          </div>

          <h1 className={`text-3xl font-extrabold tracking-tight leading-snug ${isCompleted ? 'line-through opacity-70' : ''}`}>
            {todo.title}
          </h1>

          {todo.description && (
            <p className="mt-3 text-indigo-200 text-sm leading-relaxed max-w-2xl">
              {todo.description}
            </p>
          )}
        </div>
      </div>

      {/* Detail Card */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="card p-6 mb-6 animate-slide-up">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Todo Details
          </h2>

          <DetailRow
            icon={<FiCheckCircle />}
            label="Status"
            value={todo.status}
            className={isCompleted ? 'text-indigo-600' : 'text-slate-600'}
          />

          <DetailRow
            icon={<span className={`w-2 h-2 rounded-full ${priorityStyles.dot} block mx-auto`} />}
            label="Priority"
            value={todo.priority}
          />

          <DetailRow
            icon={<FiCalendar />}
            label="Due Date"
            value={todo.dueDate ? formatDate(todo.dueDate) : 'No due date'}
            className={overdue ? 'text-red-500' : ''}
          />

          <DetailRow
            icon={<FiClock />}
            label="Created"
            value={formatDateTime(todo.createdAt)}
          />

          <DetailRow
            icon={<FiClock />}
            label="Last Updated"
            value={formatDateTime(todo.updatedAt)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            id="detail-edit-btn"
            onClick={() => setIsEditOpen(true)}
            disabled={actionLoading}
            className="btn-secondary"
          >
            <FiEdit2 /> Edit Todo
          </button>

          <button
            id="detail-toggle-btn"
            onClick={handleToggleStatus}
            disabled={actionLoading}
            className={isCompleted ? 'btn-secondary' : 'btn-primary'}
          >
            {actionLoading ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiCheckCircle />
            )}
            {isCompleted ? 'Mark as Pending' : 'Mark as Complete'}
          </button>

          <button
            id="detail-delete-btn"
            onClick={() => setIsDeleteOpen(true)}
            disabled={actionLoading}
            className="btn-danger ml-auto"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <TodoFormModal
        isOpen={isEditOpen}
        todo={todo}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEdit}
        isLoading={actionLoading}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete this todo?"
        message={`Are you sure you want to delete "${todo.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={actionLoading}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default TodoDetailPage;
