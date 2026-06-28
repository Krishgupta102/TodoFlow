import { useEffect, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiXCircle, FiX } from 'react-icons/fi';

/**
 * Individual Toast notification item.
 * Auto-dismisses after `duration` ms.
 */
const ToastItem = ({ id, type = 'success', message, onDismiss }) => {
  const [exiting, setExiting] = useState(false);

  const handleDismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => onDismiss(id), 300);
  }, [id, onDismiss]);

  useEffect(() => {
    const timer = setTimeout(handleDismiss, 4000);
    return () => clearTimeout(timer);
  }, [handleDismiss]);

  const styles = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200',
      icon: <FiCheckCircle className="text-emerald-500 text-lg shrink-0 mt-0.5" />,
      title: 'Success',
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: <FiXCircle className="text-red-500 text-lg shrink-0 mt-0.5" />,
      title: 'Error',
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: <FiInfo className="text-blue-500 text-lg shrink-0 mt-0.5" />,
      title: 'Info',
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200',
      icon: <FiAlertCircle className="text-amber-500 text-lg shrink-0 mt-0.5" />,
      title: 'Warning',
    },
  };

  const s = styles[type] || styles.success;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-lg max-w-sm w-full ${s.bg} ${
        exiting ? 'animate-toast-out' : 'animate-toast-in'
      }`}
    >
      {s.icon}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{s.title}</p>
        <p className="text-xs text-slate-600 mt-0.5 break-words">{message}</p>
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className="p-0.5 rounded text-slate-400 hover:text-slate-600 transition-colors shrink-0"
      >
        <FiX />
      </button>
    </div>
  );
};

/**
 * Toast container that renders a stack of toast notifications in the top-right corner.
 *
 * @param {Array} toasts - Array of { id, type, message }
 * @param {function} onDismiss - Callback to remove a toast by id
 */
const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div
      id="toast-container"
      className="fixed top-20 right-4 z-[100] flex flex-col gap-2.5 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};

/**
 * Custom hook to manage the toast notification state.
 * Returns the toasts array and an addToast function.
 *
 * @returns {{ toasts, addToast, removeToast }}
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

export default ToastContainer;
