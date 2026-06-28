import { Link } from 'react-router-dom';
import { FiCheckSquare } from 'react-icons/fi';

/**
 * Sticky top navigation bar for the application.
 * Displays the application brand/logo linking back to the todos dashboard.
 */
const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to="/todos"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md group-hover:shadow-indigo-200 transition-shadow">
              <FiCheckSquare className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              TodoFlow
            </span>
          </Link>

          {/* Right side: nav links */}
          <div className="flex items-center gap-1">
            <Link
              to="/todos"
              id="nav-todos-link"
              className="px-3 py-1.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              My Todos
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
