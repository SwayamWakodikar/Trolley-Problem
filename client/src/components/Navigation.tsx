import { Link, useLocation } from 'react-router-dom';
import { Home, Play, BookOpen, Info, Brain } from 'lucide-react';

function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
      isActive(path)
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Ethics and Values Lab</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/" className={linkClass('/')}>
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link to="/simulation" className={linkClass('/simulation')}>
              <Play size={18} />
              <span className="hidden sm:inline">Simulation</span>
            </Link>
            <Link to="/reflection" className={linkClass('/reflection')}>
              <BookOpen size={18} />
              <span className="hidden sm:inline">Reflection</span>
            </Link>
            <Link to="/about" className={linkClass('/about')}>
              <Info size={18} />
              <span className="hidden sm:inline">About</span>
            </Link>
            <Link to="/quiz" className={linkClass('/quiz')}>
              <Brain size={18} />
              <span className="hidden sm:inline">Quiz</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
