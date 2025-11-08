import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
          The Trolley Problem
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-6xl mb-6">🚃</div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl text-gray-600 mb-8 leading-relaxed"
        >
          You see a runaway trolley moving toward five people tied up on the tracks.
          You are standing next to a lever that controls a switch. If you pull the lever,
          the trolley will be redirected onto a side track, but there is one person tied
          up on that track.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-2xl font-semibold text-gray-800 mb-12"
        >
          Do you pull the lever?
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/simulation')}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold
                     hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto
                     shadow-lg hover:shadow-xl"
        >
          Start Simulation
          <ArrowRight size={20} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-16 p-6 bg-white rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            A Thought Experiment in Ethics
          </h2>
          <p className="text-gray-600 leading-relaxed">
            The trolley problem is one of the most famous thought experiments in moral philosophy.
            It challenges us to think about the ethics of decision-making, the value of human life,
            and whether the ends justify the means. There are no easy answers—only questions that
            reveal what we value most.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default HomePage;
