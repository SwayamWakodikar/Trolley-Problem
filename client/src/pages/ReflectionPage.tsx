import { useState, useEffect } from 'react';
import { Trash2, Save, TrendingUp, Clock, Brain } from 'lucide-react';

interface Choice {
  choice: string;
  timestamp: string;
}

interface Reflection {
  question: string;
  answer: string;
  timestamp: string;
}

function ReflectionPage() {
  const [choices, setChoices] = useState<Choice[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [answers, setAnswers] = useState({
    utilitarian: '',
    personal: '',
    dilemma: '',
  });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const choicesResult = await window.storage.get('trolley_choices', false);
      const reflectionsResult = await window.storage.get('trolley_reflections', false);
      
      if (choicesResult) {
        setChoices(JSON.parse(choicesResult.value));
      }
      if (reflectionsResult) {
        setReflections(JSON.parse(reflectionsResult.value));
      }
    } catch (error) {
      console.log('No previous data found');
    }
    setLoading(false);
  };

  const handleSaveReflection = async (question: string, answer: string, key: string) => {
    if (!answer.trim()) {
      setSaveStatus({ ...saveStatus, [key]: 'empty' });
      setTimeout(() => setSaveStatus({}), 2000);
      return;
    }

    const newReflection = { question, answer, timestamp: new Date().toISOString() };
    const updatedReflections = [...reflections, newReflection];
    
    try {
      await window.storage.set('trolley_reflections', JSON.stringify(updatedReflections), false);
      setReflections(updatedReflections);
      setSaveStatus({ ...saveStatus, [key]: 'success' });
      setTimeout(() => setSaveStatus({}), 2000);
    } catch (error) {
      setSaveStatus({ ...saveStatus, [key]: 'error' });
      setTimeout(() => setSaveStatus({}), 2000);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
      try {
        await window.storage.delete('trolley_choices', false);
        await window.storage.delete('trolley_reflections', false);
        setChoices([]);
        setReflections([]);
        setAnswers({ utilitarian: '', personal: '', dilemma: '' });
      } catch (error) {
        console.error('Error resetting data:', error);
      }
    }
  };

  const pullCount = choices.filter(c => c.choice === 'pull').length;
  const nothingCount = choices.filter(c => c.choice === 'nothing').length;
  const totalChoices = pullCount + nothingCount;
  const pullPercentage = totalChoices > 0 ? Math.round((pullCount / totalChoices) * 100) : 0;

  const getStatusIcon = (key: string) => {
    const status = saveStatus[key];
    if (status === 'success') return <span className="text-green-600">✓ Saved!</span>;
    if (status === 'error') return <span className="text-red-600">✗ Error</span>;
    if (status === 'empty') return <span className="text-yellow-600">⚠ Empty</span>;
    return null;
  };

  const reflectionQuestions = [
    {
      key: 'utilitarian',
      label: 'Was your decision utilitarian (focused on outcomes and maximizing good)?',
      placeholder: 'Consider whether you prioritized the greater good or individual rights...'
    },
    {
      key: 'personal',
      label: 'Would your answer change if you personally knew the people involved?',
      placeholder: 'How does personal connection affect moral reasoning...'
    },
    {
      key: 'dilemma',
      label: 'What was the most difficult part of making this decision?',
      placeholder: 'Reflect on the emotional and logical challenges you faced...'
    }
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your reflections...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="opacity-0 animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Reflection Journey</h1>
          <p className="text-gray-600">Explore your moral decision-making patterns and insights</p>
        </div>

        {/* Statistics Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-8 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Decision Analytics</h2>
          </div>
          
          {choices.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="mx-auto mb-3 text-gray-400" size={48} />
              <p className="text-gray-600 text-lg">No decisions recorded yet.</p>
              <p className="text-gray-500 mt-2">Try the simulation to begin your journey!</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-3xl font-bold text-blue-600">{pullCount}</p>
                  <p className="text-gray-700 text-sm">Pulled Lever</p>
                  <p className="text-xs text-gray-500 mt-1">{pullPercentage}% of time</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-3xl font-bold text-gray-600">{nothingCount}</p>
                  <p className="text-gray-700 text-sm">Did Nothing</p>
                  <p className="text-xs text-gray-500 mt-1">{100 - pullPercentage}% of time</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-3xl font-bold text-indigo-600">{totalChoices}</p>
                  <p className="text-gray-700 text-sm">Total Trials</p>
                  <p className="text-xs text-gray-500 mt-1">Decisions made</p>
                </div>
              </div>

              {/* Consistency Insight */}
              {totalChoices >= 3 && (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  <p className="font-semibold text-gray-900 mb-2">🧠 Insight:</p>
                  <p className="text-gray-700">
                    {pullPercentage > 70 
                      ? 'You tend toward utilitarian thinking, consistently choosing to maximize outcomes.'
                      : pullPercentage < 30
                      ? 'You lean toward deontological ethics, valuing the principle of non-intervention.'
                      : 'Your decisions vary, suggesting you weigh multiple ethical frameworks in your reasoning.'}
                  </p>
                </div>
              )}

              {/* Recent History */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={18} className="text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Recent History</h3>
                </div>
                <div className="space-y-2">
                  {choices.slice(-5).reverse().map((choice, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                      <span className="font-medium">
                        {choice.choice === 'pull' ? '🔄 Pulled the lever' : '⏸️ Did nothing'}
                      </span>
                      <span className="text-gray-500">
                        {new Date(choice.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reflection Questions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Deep Reflection</h2>

          <div className="space-y-6">
            {reflectionQuestions.map(({ key, label, placeholder }) => (
              <div key={key} className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  {label}
                </label>
                <textarea
                  value={answers[key as keyof typeof answers]}
                  onChange={(e) => setAnswers({ ...answers, [key]: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2
                             focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                  rows={4}
                  placeholder={placeholder}
                />
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={() => handleSaveReflection(label, answers[key as keyof typeof answers], key)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700
                               active:scale-95 transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Save size={16} />
                    Save Response
                  </button>
                  <span className="text-sm font-medium">{getStatusIcon(key)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Reflections */}
        {reflections.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Past Reflections</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Showing your {Math.min(reflections.length, 5)} most recent reflections
            </p>
            <div className="space-y-4">
              {reflections.slice(-5).reverse().map((reflection, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-900 mb-2">{reflection.question}</p>
                  <p className="text-gray-700 mb-2 italic">"{reflection.answer}"</p>
                  <p className="text-sm text-gray-500">
                    {new Date(reflection.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Management */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Management</h2>
          <p className="text-gray-600 mb-4">
            Your choices and reflections are stored securely in your browser. 
            This data persists across sessions and is private to you.
          </p>
          <button
            onClick={handleReset}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700
                       active:scale-95 transition-all flex items-center gap-2 shadow-sm"
          >
            <Trash2 size={20} />
            Reset All Data
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default ReflectionPage;