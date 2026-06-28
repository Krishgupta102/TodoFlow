import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TodosPage from './pages/TodosPage';
import TodoDetailPage from './pages/TodoDetailPage';

/**
 * Root application component.
 * Configures React Router with multi-page routing:
 *  - /        → redirects to /todos
 *  - /todos   → Main todos dashboard
 *  - /todo?id → Single todo detail view
 *  - *        → 404 fallback
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1">
          <Routes>
            {/* Redirect root to /todos */}
            <Route path="/" element={<Navigate to="/todos" replace />} />

            {/* Main todos dashboard */}
            <Route path="/todos" element={<TodosPage />} />

            {/* Todo detail page — reads ?id= query param */}
            <Route path="/todo" element={<TodoDetailPage />} />

            {/* 404 fallback */}
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
                  <p className="text-8xl font-black text-slate-100">404</p>
                  <h2 className="text-2xl font-bold text-slate-600">Page Not Found</h2>
                  <p className="text-slate-400 text-sm">The page you're looking for doesn't exist.</p>
                  <a href="/todos" className="btn-primary mt-2">← Back to Todos</a>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
