import { useEffect, useRef, useState } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import { getPriorityStyles, getStatusStyles, toInputDateValue } from '../utils/helpers';

/**
 * Form fields initial state
 */
const INITIAL_FORM = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: '',
};

/**
 * TodoFormModal - Add/Edit todo modal dialog using native <dialog>.
 *
 * @param {boolean} isOpen - controls dialog visibility
 * @param {Object|null} todo - if editing, pass existing todo data; null for create
 * @param {function} onClose - callback on modal close
 * @param {function} onSubmit - callback with form data
 * @param {boolean} isLoading - disables form controls while submitting
 */
const TodoFormModal = ({ isOpen, todo, onClose, onSubmit, isLoading }) => {
  const dialogRef = useRef(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const isEditing = !!todo;

  // Sync dialog open/close with native API
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (todo) {
      setForm({
        title: todo.title || '',
        description: todo.description || '',
        priority: todo.priority || 'Medium',
        status: todo.status || 'Pending',
        dueDate: toInputDateValue(todo.dueDate),
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [todo, isOpen]);

  // Light-dismiss fallback for Safari
  const handleBackdropClick = (e) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInsideDialog =
      rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width;
    if (!isInsideDialog) onClose();
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    else if (form.title.trim().length > 200) newErrors.title = 'Title cannot exceed 200 characters.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    await onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || null,
    });
  };

  return (
    <dialog
      ref={dialogRef}
      id="todo-form-dialog"
      closedby="any"
      onCancel={onClose}
      onClick={handleBackdropClick}
      className="w-full max-w-lg rounded-2xl p-0 shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm animate-slide-up border-0 outline-none"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="form-dialog-title" className="text-xl font-bold text-slate-800">
            {isEditing ? '✏️ Edit Todo' : '✨ Add New Todo'}
          </h2>
          <button
            id="close-form-modal-btn"
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="todo-title" className="form-label">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="todo-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className={`form-input ${errors.title ? 'border-red-400 ring-2 ring-red-100 focus:ring-red-300' : ''}`}
              required
              aria-describedby={errors.title ? 'title-error' : undefined}
              aria-invalid={!!errors.title}
              disabled={isLoading}
            />
            {errors.title && (
              <p id="title-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-500 font-medium">
                <FiAlertCircle /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="todo-description" className="form-label">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="todo-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more details..."
              rows={3}
              className="form-input resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Priority & Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="todo-priority" className="form-label">Priority</label>
              <select
                id="todo-priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="form-input cursor-pointer"
                disabled={isLoading}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>
            <div>
              <label htmlFor="todo-status" className="form-label">Status</label>
              <select
                id="todo-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-input cursor-pointer"
                disabled={isLoading}
              >
                <option value="Pending">⏳ Pending</option>
                <option value="Completed">✅ Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="todo-dueDate" className="form-label">Due Date</label>
            <input
              id="todo-dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className="form-input cursor-pointer"
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              id="form-cancel-btn"
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              id="form-submit-btn"
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Create Todo'
              )}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

/**
 * ConfirmDialog - Confirmation dialog for delete actions using native <dialog>.
 *
 * @param {boolean} isOpen - controls dialog visibility
 * @param {string} title - dialog heading
 * @param {string} message - confirmation message body
 * @param {function} onConfirm - callback when user confirms
 * @param {function} onCancel - callback when user cancels/dismisses
 * @param {boolean} isLoading - disables buttons while action is processing
 */
const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, isLoading }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isInside =
      rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width;
    if (!isInside && !isLoading) onCancel();
  };

  return (
    <dialog
      ref={dialogRef}
      id="confirm-delete-dialog"
      closedby="any"
      onCancel={onCancel}
      onClick={handleBackdropClick}
      className="w-full max-w-sm rounded-2xl p-0 shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm animate-slide-up border-0 outline-none"
    >
      <div className="p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🗑️</span>
        </div>
        <h3 id="confirm-dialog-title" className="text-lg font-bold text-slate-800 mb-2">
          {title || 'Delete Todo?'}
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          {message || 'This action cannot be undone.'}
        </p>
        <div className="flex gap-3">
          <button
            id="confirm-cancel-btn"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-danger flex-1"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export { TodoFormModal, ConfirmDialog };
