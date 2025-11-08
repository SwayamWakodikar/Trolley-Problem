import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: { text: string; points: { utilitarian: number; deontological: number; virtue: number } }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: 'A lie that saves someone from emotional pain is:',
    options: [
      { text: 'Acceptable if it prevents suffering', points: { utilitarian: 2, deontological: 0, virtue: 1 } },
      { text: 'Never acceptable; honesty is paramount', points: { utilitarian: 0, deontological: 2, virtue: 1 } },
      { text: 'Depends on the person\'s character and intentions', points: { utilitarian: 1, deontological: 0, virtue: 2 } },
    ],
  },
  {
    id: 2,
    question: 'If you could save five strangers by sacrificing one, you should:',
    options: [
      { text: 'Do it - five lives outweigh one', points: { utilitarian: 2, deontological: 0, virtue: 0 } },
      { text: 'Never - actively killing is always wrong', points: { utilitarian: 0, deontological: 2, virtue: 1 } },
      { text: 'Consider the context and relationships involved', points: { utilitarian: 1, deontological: 1, virtue: 2 } },
    ],
  },
  {
    id: 3,
    question: 'Stealing medicine to save a dying person is:',
    options: [
      { text: 'Justified by the good outcome', points: { utilitarian: 2, deontological: 0, virtue: 1 } },
      { text: 'Wrong because stealing violates moral law', points: { utilitarian: 0, deontological: 2, virtue: 0 } },
      { text: 'A complex situation requiring wisdom and compassion', points: { utilitarian: 1, deontological: 0, virtue: 2 } },
    ],
  },
  {
    id: 4,
    question: 'The most important factor in moral decision-making is:',
    options: [
      { text: 'The consequences and outcomes', points: { utilitarian: 2, deontological: 0, virtue: 0 } },
      { text: 'Following universal moral rules', points: { utilitarian: 0, deontological: 2, virtue: 0 } },
      { text: 'Acting with virtue and good character', points: { utilitarian: 0, deontological: 0, virtue: 2 } },
    ],
  },
];

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ utilitarian: 0, deontological: 0, virtue: 0 });
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (points: { utilitarian: number; deontological: number; virtue: number }) => {
    setScores({
      utilitarian: scores.utilitarian + points.utilitarian,
      deontological: scores.deontological + points.deontological,
      virtue: scores.virtue + points.virtue,
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const getResult = () => {
    const max = Math.max(scores.utilitarian, scores.deontological, scores.virtue);

    if (scores.utilitarian === max) {
      return {
        type: 'Utilitarian Thinker',
        description: 'You prioritize outcomes and believe in maximizing overall happiness and wellbeing. You focus on consequences rather than rigid rules.',
        icon: '⚖️',
        color: 'blue',
      };
    } else if (scores.deontological === max) {
      return {
        type: 'Deontological Thinker',
        description: 'You believe in universal moral principles and that certain actions are inherently right or wrong, regardless of outcomes.',
        icon: '📜',
        color: 'gray',
      };
    } else {
      return {
        type: 'Virtue Ethics Thinker',
        description: 'You emphasize character, wisdom, and what a person of good moral character would do in a given situation.',
        icon: '💎',
        color: 'green',
      };
    }
  };

  const restart = () => {
    setCurrentQuestion(0);
    setScores({ utilitarian: 0, deontological: 0, virtue: 0 });
    setShowResults(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          What Type of Moral Thinker Are You?
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Answer these questions to discover your ethical perspective
        </p>

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-lg shadow-xl p-8"
            >
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold text-gray-500">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <div className="flex gap-1">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 w-8 rounded ${
                          index <= currentQuestion ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {questions[currentQuestion].question}
                </h2>
              </div>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.points)}
                    className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 rounded-lg
                               transition-colors border-2 border-transparent hover:border-blue-600
                               font-medium text-gray-700"
                  >
                    {option.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl p-8"
            >
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{getResult().icon}</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  You are a {getResult().type}!
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  {getResult().description}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Your Scores:</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">Utilitarian</span>
                      <span className="font-semibold">{scores.utilitarian}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(scores.utilitarian / 8) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">Deontological</span>
                      <span className="font-semibold">{scores.deontological}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-600 h-2 rounded-full"
                        style={{ width: `${(scores.deontological / 8) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">Virtue Ethics</span>
                      <span className="font-semibold">{scores.virtue}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(scores.virtue / 8) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
                <p className="text-gray-700">
                  <strong>Remember:</strong> Most people use a combination of ethical frameworks
                  in their decision-making. No single approach is definitively "correct" - each
                  offers valuable insights into moral reasoning.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restart}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold
                           hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Take Quiz Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default QuizPage;
