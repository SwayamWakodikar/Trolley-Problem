import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import SimulationPage from './pages/SimulationPage';
import ReflectionPage from './pages/ReflectionPage';
import AboutPage from './pages/AboutPage';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/reflection" element={<ReflectionPage />} /> 
          <Route path="/about" element={<AboutPage />} />
          <Route path="/quiz" element={<QuizPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
