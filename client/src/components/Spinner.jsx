/**
 * Loading spinner component with optional label text.
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} label - optional text shown below spinner
 */
const Spinner = ({ size = 'md', label = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-9 h-9 border-[3px]',
    lg: 'w-14 h-14 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-label="Loading">
      <div
        className={`${sizeClasses[size]} rounded-full border-indigo-200 border-t-indigo-600 animate-spin`}
      />
      {label && <p className="text-sm text-slate-500 font-medium">{label}</p>}
    </div>
  );
};

export default Spinner;
