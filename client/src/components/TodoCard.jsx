import { useNavigate } from 'react-router-dom';
import {
  FiEye, FiEdit2, FiTrash2, FiCheckCircle, FiClock,
  FiCalendar, FiAlertTriangle,
} from 'react-icons/fi';
import { formatDate, getPriorityStyles, getStatusStyles, isOverdue, truncateText } from '../utils/helpers';

/**
 * TodoCard - A rich card component for displaying a single todo in the list.
 *
 * @param {Object} todo - The todo document
 * @param {function} onEdit - Opens edit modal for this todo
 * @param {function} onDelete - Opens confirm delete dialog for this todo
 * @param {function} onToggleStatus - Toggles Pending/Completed
 * @param {boolean} isActionLoading - Disables action buttons during processing
 */
const TodoCard = ({ todo, onEdit, onDelete, onToggleStatus, isActionLoading }) => {
  const navigate = useNavigate();
  const priorityStyles = getPriorityStyles(todo.priority);
  const statusStyles = getStatusStyles(todo.status);
  const overdue = isOverdue(todo.dueDate) && todo.status === 'Pending';
  const isCompleted = todo.status === 'Completed';

  const handleView = () => {
    navigate(`/todo?id=${todo._id}`);
  };

  return (
    <article
      className={`card p-5 flex flex-col gap-4 group animate-fade-in transition-all duration-300 ${
        isCompleted ? 'opacity-75' : ''
      }`}
    >
      {/* Top Row: Priority badge + Status badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority badge */}
          <span className={`badge ${priorityStyles.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priorityStyles.dot}`} />
            {todo.priority}
          </span>

          {/* Status badge */}
          <span className={`badge ${statusStyles.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyles.dot}`} />
            {todo.status}
          </span>

          {/* Overdue warning */}
          {overdue && (
            <span className="badge bg-red-100 text-red-600 border border-red-200">
              <FiAlertTriangle className="text-xs" />
              Overdue
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <h3
          className={`text-base font-bold text-slate-800 leading-snug mb-1.5 ${
            isCompleted ? 'line-through text-slate-400' : ''
          }`}
        >
          {todo.title}
        </h3>
        {todo.description && (
          <p className="text-sm text-slate-500 leading-relaxed">
            {truncateText(todo.description, 90)}
          </p>
        )}
      </div>

      {/* Due Date */}
      {todo.dueDate && (
        <div className={`flex items-center gap-1.5 text-xs font-medium ${overdue ? 'text-red-500' : 'text-slate-400'}`}>
          <FiCalendar className="shrink-0" />
          <span>Due {formatDate(todo.dueDate)}</span>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-slate-100" />

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* View Button */}
        <button
          id={`view-btn-${todo._id}`}
          onClick={handleView}
          className="btn-ghost text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50"
          title="View details"
        >
          <FiEye />
          <span>View</span>
        </button>

        {/* Edit Button */}
        <button
          id={`edit-btn-${todo._id}`}
          onClick={() => onEdit(todo)}
          disabled={isActionLoading}
          className="btn-ghost text-slate-500 hover:text-slate-700"
          title="Edit todo"
        >
          <FiEdit2 />
          <span>Edit</span>
        </button>

        {/* Complete/Undo Button */}
        <button
          id={`toggle-btn-${todo._id}`}
          onClick={() => onToggleStatus(todo._id)}
          disabled={isActionLoading}
          className={`btn-ghost ${
            isCompleted
              ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              : 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50'
          }`}
          title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        >
          {isCompleted ? (
            <>
              <FiClock />
              <span>Undo</span>
            </>
          ) : (
            <>
              <FiCheckCircle />
              <span>Complete</span>
            </>
          )}
        </button>

        {/* Delete Button */}
        <button
          id={`delete-btn-${todo._id}`}
          onClick={() => onDelete(todo)}
          disabled={isActionLoading}
          className="btn-ghost text-red-400 hover:text-red-600 hover:bg-red-50 ml-auto"
          title="Delete todo"
        >
          <FiTrash2 />
          <span>Delete</span>
        </button>
      </div>
    </article>
  );
};

export default TodoCard;
