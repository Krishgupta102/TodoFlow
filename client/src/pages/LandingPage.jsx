import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckSquare, FiArrowRight, FiSearch, FiCheckCircle,
  FiAlertCircle, FiEdit2, FiTrash2, FiClock, FiCalendar,
  FiZap, FiLayers, FiShield,
} from 'react-icons/fi';

/**
 * A single interactive mock todo card for the landing page hero section.
 * Demonstrates the Pending/Completed toggle using local state only.
 */
const MockTodoCard = ({ title, priority, dueLabel, defaultCompleted = false }) => {
  const [completed, setCompleted] = useState(defaultCompleted);

  const priorityColors = {
    High: { badge: 'bg-red-100 text-red-600', dot: 'bg-red-500' },
    Medium: { badge: 'bg-amber-100 text-amber-600', dot: 'bg-amber-500' },
    Low: { badge: 'bg-emerald-100 text-emerald-600', dot: 'bg-emerald-500' },
  };
  const p = priorityColors[priority] || priorityColors.Medium;

  return (
    <div
      className={`bg-white rounded-2xl border shadow-md p-4 transition-all duration-300 cursor-pointer select-none ${
        completed ? 'opacity-60 border-slate-100' : 'border-slate-200 hover:shadow-lg hover:-translate-y-0.5'
      }`}
      onClick={() => setCompleted((v) => !v)}
      title="Click to toggle status"
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${p.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
          {priority}
        </span>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
            completed
              ? 'bg-indigo-100 text-indigo-600'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${completed ? 'bg-indigo-500' : 'bg-slate-400'}`} />
          {completed ? 'Completed' : 'Pending'}
        </span>
      </div>

      <p className={`text-sm font-bold text-slate-800 mb-1 ${completed ? 'line-through text-slate-400' : ''}`}>
        {title}
      </p>

      <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
        <FiCalendar className="shrink-0" />
        <span>{dueLabel}</span>
      </div>

      <div className="border-t border-slate-100 pt-3 flex items-center gap-2">
        <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors">
          <FiCheckCircle /> {completed ? 'Undo' : 'Complete'}
        </button>
        <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <FiEdit2 /> Edit
        </button>
        <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto">
          <FiTrash2 /> Delete
        </button>
      </div>
    </div>
  );
};

/**
 * A single feature highlight card for the landing page.
 */
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl mb-4 shadow-md shadow-indigo-200">
      {icon}
    </div>
    <h3 className="text-base font-bold text-slate-800 mb-1.5">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
  </div>
);

/**
 * LandingPage — The application home page at route /
 *
 * Features:
 *  - Hero section with gradient background, app name, and CTA
 *  - Interactive mock todo cards (click to toggle state)
 *  - Feature highlight cards
 *  - "Go to Dashboard" button navigating to /todos
 */
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white overflow-hidden">

        {/* Decorative background orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — Text Content */}
            <div className="animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 border border-white/25 rounded-full text-xs font-semibold text-indigo-100 mb-6 backdrop-blur-sm">
                <FiZap className="text-amber-300" />
                Streamline your productivity
              </div>

              <h1 className="text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-5">
                Stay on top of
                <span className="block bg-gradient-to-r from-indigo-200 to-violet-200 bg-clip-text text-transparent">
                  everything.
                </span>
              </h1>

              <p className="text-indigo-100 text-lg leading-relaxed mb-8 max-w-md">
                <strong className="text-white">TodoFlow</strong> is a beautiful, full-featured task
                manager. Create, organize, filter, and track your todos across a clean
                multi-page interface — with real-time search, priority levels, and due-date tracking.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  id="hero-go-to-dashboard-btn"
                  onClick={() => navigate('/todos')}
                  className="flex items-center gap-2.5 px-7 py-3.5 bg-white text-indigo-700 font-bold text-sm rounded-xl shadow-lg hover:shadow-white/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  Go to Dashboard
                  <FiArrowRight className="text-base" />
                </button>
                <a
                  href="#features"
                  className="flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold text-sm rounded-xl border border-white/25 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                >
                  Learn More
                </a>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/15">
                {[
                  { value: '3 Pages', label: 'Multi-page app' },
                  { value: 'CRUD', label: 'Full operations' },
                  { value: '4 Filters', label: 'Search & sort' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-black text-white">{value}</p>
                    <p className="text-xs text-indigo-300 font-medium mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Interactive Mock Cards */}
            <div className="hidden lg:block animate-slide-up">
              <div className="relative">
                {/* Decorative glass panel behind cards */}
                <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl -rotate-1 scale-105" />

                <div className="relative p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">
                      Live Preview — click a card!
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-indigo-300">
                      <FiSearch className="text-xs" />
                      <span>Search todos...</span>
                    </div>
                  </div>

                  <MockTodoCard
                    title="Design the landing page hero section"
                    priority="High"
                    dueLabel="Due Jun 30, 2026"
                    defaultCompleted={false}
                  />
                  <MockTodoCard
                    title="Write unit tests for the API layer"
                    priority="Medium"
                    dueLabel="Due Jul 5, 2026"
                    defaultCompleted={true}
                  />
                  <MockTodoCard
                    title="Review pull requests on the repo"
                    priority="Low"
                    dueLabel="Due Jul 10, 2026"
                    defaultCompleted={false}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Navigation Flow ───────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
            {[
              { label: 'Home', path: '/', active: true },
              { label: '↓', path: null },
              { label: 'My Todos', path: '/todos' },
              { label: '↓', path: null },
              { label: 'Todo Details (?id=...)', path: null },
            ].map(({ label, path, active }, idx) => (
              path ? (
                <a
                  key={idx}
                  href={path}
                  className={`px-4 py-1.5 rounded-full border transition-colors ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'text-slate-600 border-slate-200 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  {label}
                </a>
              ) : (
                <span key={idx} className="text-slate-400">{label}</span>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Why TodoFlow</p>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">
              Everything you need to stay organized
            </h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              A full-stack React application with a clean multi-page architecture,
              real backend, and a comprehensive set of task management features.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FiLayers />}
              title="Multi-Page Navigation"
              description="Three distinct pages — Home, Todo List (/todos), and Todo Details (/todo?id=...) — with clean client-side routing via React Router."
            />
            <FeatureCard
              icon={<FiSearch />}
              title="Search, Filter & Sort"
              description="Real-time debounced search, filter by priority and status, and sort by date or priority level — all wired to the backend."
            />
            <FeatureCard
              icon={<FiCheckCircle />}
              title="Full CRUD Operations"
              description="Create, read, update, and delete todos. Toggle between Pending and Completed with a single click, from both the list and detail views."
            />
            <FeatureCard
              icon={<FiAlertCircle />}
              title="Priority Levels"
              description="Categorize each task as High, Medium, or Low priority. Overdue todos are flagged automatically with a visual warning badge."
            />
            <FeatureCard
              icon={<FiClock />}
              title="Due Date Tracking"
              description="Set due dates for each todo. The detail page surfaces Created At and Updated At timestamps in addition to the due date."
            />
            <FeatureCard
              icon={<FiShield />}
              title="React + Express + MongoDB"
              description="A production-grade full-stack architecture: Vite + React 19 frontend, Express REST API backend, and MongoDB with Mongoose for persistence."
            />
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-3xl mx-auto mb-5 backdrop-blur-sm">
            <FiCheckSquare />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-3">
            Ready to get organized?
          </h2>
          <p className="text-indigo-200 text-sm mb-8 leading-relaxed">
            Head to the dashboard and start managing your tasks right away.
          </p>
          <button
            id="cta-go-to-dashboard-btn"
            onClick={() => navigate('/todos')}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-indigo-700 font-bold text-sm rounded-xl shadow-lg hover:shadow-white/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Go to Dashboard
            <FiArrowRight />
          </button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-100 py-6 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <FiCheckSquare className="text-white text-xs" />
          </div>
          <span className="font-bold text-slate-700">TodoFlow</span>
          <span className="text-slate-300">·</span>
          <span>Built with React + Express + MongoDB</span>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
