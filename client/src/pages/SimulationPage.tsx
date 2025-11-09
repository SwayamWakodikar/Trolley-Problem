import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

type Choice = 'pull' | 'nothing' | null;

function SimulationPage() {
  const [gameState, setGameState] = useState<'ready' | 'moving' | 'result'>('ready');
  const [choice, setChoice] = useState<Choice>(null);
  const [leverPulled, setLeverPulled] = useState(false);
  const [trolleyPosition, setTrolleyPosition] = useState({ x: 50, y: 180 });

  const makeChoice = (selectedChoice: 'pull' | 'nothing') => {
    setChoice(selectedChoice);
    const shouldPull = selectedChoice === 'pull';
    setLeverPulled(shouldPull);
    setGameState('moving');

    // Animate trolley
    const startTime = Date.now();
    const duration = 3000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      let newX, newY;
      
      if (progress < 0.6) {
        // First part: move along straight track to fork (x: 50 to 350)
        const segment1Progress = progress / 0.6;
        newX = 50 + (300 * segment1Progress);
        newY = 180;
      } else {
        // Second part: after the fork (x: 350 to 550)
        const segment2Progress = (progress - 0.6) / 0.4;
        newX = 350 + (200 * segment2Progress);
        
        if (shouldPull) {
          // Follow curved path upward
          newY = 180 - (100 * segment2Progress);
        } else {
          // Continue straight
          newY = 180;
        }
      }
      
      setTrolleyPosition({ x: newX, y: newY });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setGameState('result');
      }
    };
    
    requestAnimationFrame(animate);
  };

  const restart = () => {
    setGameState('ready');
    setChoice(null);
    setLeverPulled(false);
    setTrolleyPosition({ x: 50, y: 180 });
  };

  const getResultText = () => {
    if (choice === 'pull') {
      return {
        title: 'You Pulled the Lever',
        description: '1 person sacrificed to save 5 people.',
        philosophy: '"The greatest good for the greatest number." - Utilitarian perspective',
      };
    } else {
      return {
        title: 'You Did Nothing',
        description: '5 people sacrificed. You chose not to intervene.',
        philosophy: '"Do no harm. The act of killing is wrong, regardless of outcomes." - Deontological perspective',
      };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-3">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">The Trolley Dilemma</h1>
        <p className="text-gray-600">Make your choice before the trolley reaches the fork</p>
      </div>

      <div className="relative bg-white rounded-xl shadow-2xl p-8 mb-8 overflow-hidden h-[400px]" >
        <svg viewBox="0 0 800 400" className="w-full h-auto">
          {/* Main track */}
          <path
            d="M 50 200 L 350 200"
            stroke="#374151"
            strokeWidth="8"
            fill="none"
          />

          {/* Straight track */}
          <path
            d="M 350 200 L 550 200"
            stroke="#374151"
            strokeWidth="8"
            fill="none"
            opacity={leverPulled ? 0.3 : 1}
            style={{ transition: 'opacity 0.5s' }}
          />

          {/* Diverted track */}
          <path
            d="M 350 200 L 550 100"
            stroke="#374151"
            strokeWidth="8"
            fill="none"
            opacity={leverPulled ? 1 : 0.3}
            style={{ transition: 'opacity 0.5s' }}
          />

          {/* Trolley */}
          <g transform={`translate(${trolleyPosition.x}, ${trolleyPosition.y})`}>
            <rect x="-25" y="-15" width="50" height="30" fill="#dc2626" rx="3" />
            <text x="0" y="5" textAnchor="middle" fill="white" fontSize="20">🚃</text>
          </g>

          {/* 5 people on straight track */}
          <g transform="translate(600, 200)">
            <circle cx="0" cy="0" r="15" fill="#ef4444" />
            <circle cx="30" cy="0" r="15" fill="#ef4444" />
            <circle cx="60" cy="0" r="15" fill="#ef4444" />
            <circle cx="90" cy="0" r="15" fill="#ef4444" />
            <circle cx="120" cy="0" r="15" fill="#ef4444" />
            <text x="60" y="40" textAnchor="middle" fontSize="16" fill="#374151" fontWeight="600">5 people</text>
          </g>

          {/* 1 person on diverted track */}
          <g transform="translate(600, 100)">
            <circle cx="0" cy="0" r="15" fill="#3b82f6" />
            <text x="0" y="30" textAnchor="middle" fontSize="16" fill="#374151" fontWeight="600">1 person</text>
          </g>

          {/* Lever */}
          <g transform={`translate(350, 200) rotate(${leverPulled ? -45 : 0})`}>
            <rect x="-5" y="-40" width="10" height="80" fill="#f59e0b" rx="2" 
                  style={{ transition: 'all 0.5s' }} />
            <circle cx="0" cy="-40" r="8" fill="#dc2626" />
          </g>
        </svg>
      </div>

      {gameState === 'ready' && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => makeChoice('pull')}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold
                       hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Pull the Lever
          </button>
          <button
            onClick={() => makeChoice('nothing')}
            className="bg-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold
                       hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Do Nothing
          </button>
        </div>
      )}

      {gameState === 'moving' && (
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700">
            {choice === 'pull' ? 'You pulled the lever...' : 'You chose not to intervene...'}
          </p>
        </div>
      )}

      {gameState === 'result' && (
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{getResultText().title}</h2>
          <p className="text-xl text-gray-700 mb-6">{getResultText().description}</p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <p className="text-gray-700 italic">{getResultText().philosophy}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Reflect on your decision:</h3>
            <p className="text-gray-600 mb-2">
              • Would your answer change if you knew the people involved?
            </p>
            <p className="text-gray-600 mb-2">
              • Is it more moral to act or to refrain from acting?
            </p>
            <p className="text-gray-600">
              • Can we truly quantify the value of human lives?
            </p>
          </div>

          <button
            onClick={restart}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold
                       hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw size={20} />
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}

export default SimulationPage;