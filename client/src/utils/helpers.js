/**
 * Utility helper functions for the Todo application.
 */

/**
 * Format a date string to a readable format: "Jun 28, 2026"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return 'No date set';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date string to include time: "Jun 28, 2026, 10:30 AM"
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Returns true if the due date is in the past (overdue).
 * @param {string|Date} dueDate
 * @returns {boolean}
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
};

/**
 * Returns a Tailwind CSS color class for a given priority.
 * @param {string} priority - 'Low' | 'Medium' | 'High'
 * @returns {string}
 */
export const getPriorityStyles = (priority) => {
  switch (priority) {
    case 'High':
      return {
        badge: 'bg-red-100 text-red-700 border border-red-200',
        dot: 'bg-red-500',
        ring: 'ring-red-200',
      };
    case 'Medium':
      return {
        badge: 'bg-amber-100 text-amber-700 border border-amber-200',
        dot: 'bg-amber-500',
        ring: 'ring-amber-200',
      };
    case 'Low':
    default:
      return {
        badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        dot: 'bg-emerald-500',
        ring: 'ring-emerald-200',
      };
  }
};

/**
 * Returns Tailwind CSS classes for a given status.
 * @param {string} status - 'Pending' | 'Completed'
 * @returns {Object}
 */
export const getStatusStyles = (status) => {
  if (status === 'Completed') {
    return {
      badge: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      dot: 'bg-indigo-500',
    };
  }
  return {
    badge: 'bg-slate-100 text-slate-600 border border-slate-200',
    dot: 'bg-slate-400',
  };
};

/**
 * Truncate a string to a max length, appending "..." if cut.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

/**
 * Format a date string to ISO date input value "YYYY-MM-DD"
 * @param {string|Date} date
 * @returns {string}
 */
export const toInputDateValue = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};
