import { FiClipboard } from 'react-icons/fi';

/**
 * EmptyState component displayed when no todos exist or match filters.
 *
 * @param {string} title - Heading text
 * @param {string} subtitle - Descriptive subtext
 * @param {React.ReactNode} action - Optional CTA button/element
 */
const EmptyState = ({ title = 'No todos found', subtitle = 'Start by creating your first todo!', action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-50 to-violet-100 flex items-center justify-center shadow-inner">
          <FiClipboard className="text-5xl text-indigo-300" />
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-violet-200 opacity-70" />
        <div className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-indigo-300 opacity-60" />
        <div className="absolute top-4 -left-4 w-2 h-2 rounded-full bg-slate-300 opacity-80" />
      </div>

      <h3 className="text-xl font-bold text-slate-700 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-6">{subtitle}</p>

      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
