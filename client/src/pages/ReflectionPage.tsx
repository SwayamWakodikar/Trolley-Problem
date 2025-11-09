import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Users, TrendingUp, MessageCircle, AlertCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface VoteData {
  pullLeverVotes: number;
  doNothingVotes: number;
  totalVotes: number;
}

interface Reflection {
  _id: string;
  text: string;
  choice: 'pull' | 'nothing';
  timestamp: string;
  upvotes: number;
  downvotes: number;
}

function ReflectionPage() {
  const [voteData, setVoteData] = useState<VoteData>({
    pullLeverVotes: 0,
    doNothingVotes: 0,
    totalVotes: 0,
  });
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [newReflection, setNewReflection] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<'pull' | 'nothing'>('pull');
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<'pull' | 'nothing' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
    checkIfVoted();
  }, []);

  const checkIfVoted = () => {
    const voted = localStorage.getItem('trolley_has_voted');
    const vote = localStorage.getItem('trolley_user_vote');
    if (voted === 'true' && vote) {
      setHasVoted(true);
      setUserVote(vote as 'pull' | 'nothing');
    }
  };

  const loadData = async () => {
    try {
      setError(null);
      
      // Fetch votes
      const votesResponse = await fetch(`${API_URL}/votes`);
      if (!votesResponse.ok) throw new Error('Failed to fetch votes');
      const votesData = await votesResponse.json();
      setVoteData(votesData);

      // Fetch reflections
      const reflectionsResponse = await fetch(`${API_URL}/reflections`);
      if (!reflectionsResponse.ok) throw new Error('Failed to fetch reflections');
      const reflectionsData = await reflectionsResponse.json();
      setReflections(reflectionsData);

      setLoading(false);
    } catch (err) {
      setError('Failed to load data. Please check if the server is running.');
      console.error(err);
      setLoading(false);
    }
  };

  const handleVote = async (choice: 'pull' | 'nothing') => {
    if (hasVoted) return;
    
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`${API_URL}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ choice }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit vote');
      }

      const data = await response.json();
      setVoteData(data);
      setHasVoted(true);
      setUserVote(choice);
      
      // Store in localStorage to prevent duplicate voting
      localStorage.setItem('trolley_has_voted', 'true');
      localStorage.setItem('trolley_user_vote', choice);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReflection = async () => {
    if (!newReflection.trim() || !hasVoted || submitting) return;
    
    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch(`${API_URL}/reflections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newReflection,
          choice: selectedChoice,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit reflection');

      const data = await response.json();
      setReflections([data, ...reflections]);
      setNewReflection('');
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReflectionVote = async (id: string, voteType: 'up' | 'down') => {
    try {
      const response = await fetch(`${API_URL}/reflections/${id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ voteType }),
      });

      if (!response.ok) throw new Error('Failed to vote on reflection');

      const updatedReflection = await response.json();
      setReflections(prev =>
        prev.map(ref => (ref._id === id ? updatedReflection : ref))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const pullPercentage = voteData.totalVotes > 0 
    ? Math.round((voteData.pullLeverVotes / voteData.totalVotes) * 100) 
    : 0;

  const doNothingPercentage = 100 - pullPercentage;

  const getTimeSince = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading community insights...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Reflections</h1>
        <p className="text-gray-600">See how others have approached this moral dilemma</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Voting Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-8 border border-blue-100">
        <div className="flex items-center gap-2 mb-6">
          <Users className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Global Poll</h2>
        </div>

        {!hasVoted ? (
          <div>
            <p className="text-gray-700 mb-4 text-lg">What would you do?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleVote('pull')}
                disabled={submitting}
                className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700
                           disabled:bg-gray-400 disabled:cursor-not-allowed
                           active:scale-95 transition-all shadow-md text-left"
              >
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-bold text-lg mb-1">Pull the Lever</div>
                <div className="text-sm opacity-90">Save 5 lives, sacrifice 1</div>
              </button>
              
              <button
                onClick={() => handleVote('nothing')}
                disabled={submitting}
                className="bg-gray-600 text-white p-6 rounded-lg hover:bg-gray-700
                           disabled:bg-gray-400 disabled:cursor-not-allowed
                           active:scale-95 transition-all shadow-md text-left"
              >
                <div className="text-2xl mb-2">⏸️</div>
                <div className="font-bold text-lg mb-1">Do Nothing</div>
                <div className="text-sm opacity-90">Let fate take its course</div>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <p className="text-green-600 font-semibold mb-2">✓ Thank you for voting!</p>
              <p className="text-gray-700">
                You chose to {userVote === 'pull' ? 'pull the lever' : 'do nothing'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Pull Lever</span>
                  <span className="text-2xl font-bold text-blue-600">{pullPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${pullPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{voteData.pullLeverVotes.toLocaleString()} votes</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Do Nothing</span>
                  <span className="text-2xl font-bold text-gray-600">{doNothingPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gray-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${doNothingPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{voteData.doNothingVotes.toLocaleString()} votes</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-gray-600" />
                <p className="text-gray-700">
                  <strong>{voteData.totalVotes.toLocaleString()}</strong> people have participated
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Reflection Section */}
      {hasVoted && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Share Your Thoughts</h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your reflection on this dilemma:
            </label>
            <textarea
              value={newReflection}
              onChange={(e) => setNewReflection(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2
                         focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
              rows={4}
              placeholder="What made this decision difficult for you? Share your reasoning..."
              maxLength={500}
              disabled={submitting}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">{newReflection.length}/500</span>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Your choice:</label>
                <select
                  value={selectedChoice}
                  onChange={(e) => setSelectedChoice(e.target.value as 'pull' | 'nothing')}
                  className="border-2 border-gray-300 rounded px-3 py-1 text-sm"
                  disabled={submitting}
                >
                  <option value="pull">Pulled Lever</option>
                  <option value="nothing">Did Nothing</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmitReflection}
            disabled={!newReflection.trim() || submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700
                       disabled:bg-gray-400 disabled:cursor-not-allowed
                       active:scale-95 transition-all"
          >
            {submitting ? 'Submitting...' : 'Share Reflection'}
          </button>
        </div>
      )}

      {/* Community Reflections */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Reflections</h2>

        <div className="space-y-4">
          {reflections.map((reflection) => (
            <div
              key={reflection._id}
              className={`p-4 rounded-lg border-2 transition-all ${
                reflection.choice === 'pull'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {reflection.choice === 'pull' ? '🔄' : '⏸️'}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {reflection.choice === 'pull' ? 'Pulled the lever' : 'Did nothing'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{getTimeSince(reflection.timestamp)}</span>
              </div>

              <p className="text-gray-700 mb-3 leading-relaxed">{reflection.text}</p>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleReflectionVote(reflection._id, 'up')}
                  className="flex items-center gap-1 text-gray-600 hover:text-green-600
                             transition-colors"
                >
                  <ThumbsUp size={16} />
                  <span className="text-sm font-medium">{reflection.upvotes}</span>
                </button>

                <button
                  onClick={() => handleReflectionVote(reflection._id, 'down')}
                  className="flex items-center gap-1 text-gray-600 hover:text-red-600
                             transition-colors"
                >
                  <ThumbsDown size={16} />
                  <span className="text-sm font-medium">{reflection.downvotes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {reflections.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
            <p>No reflections yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReflectionPage;