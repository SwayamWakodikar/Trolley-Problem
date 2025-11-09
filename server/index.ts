// server/index.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trolley-problem')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Vote Schema
const voteSchema = new mongoose.Schema({
  choice: { type: String, enum: ['pull', 'nothing'], required: true },
  // ipAddress: { type: String }, // Optional: to prevent duplicate votes
  // userAgent: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const Vote = mongoose.model('Vote', voteSchema);

// Reflection Schema
const reflectionSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 500 },
  choice: { type: String, enum: ['pull', 'nothing'], required: true },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now }
});

const Reflection = mongoose.model('Reflection', reflectionSchema);

// Routes

// Get vote statistics
app.get('/api/votes', async (req, res) => {
  try {
    const pullVotes = await Vote.countDocuments({ choice: 'pull' });
    const nothingVotes = await Vote.countDocuments({ choice: 'nothing' });
    
    res.json({
      pullLeverVotes: pullVotes,
      doNothingVotes: nothingVotes,
      totalVotes: pullVotes + nothingVotes
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// Submit a vote
app.post('/api/votes', async (req, res) => {
  try {
    const { choice } = req.body;
    // const ipAddress = req.ip;
    // const userAgent = req.headers['user-agent'];

    // Optional: Check if this IP has already voted
    // const existingVote = await Vote.findOne({ ipAddress });
    // if (existingVote) {
    //   return res.status(400).json({ error: 'You have already voted' });
    // }

    const vote = new Vote({
      choice,
      //ipAddress,
      //userAgent
    });

    await vote.save();
    
    // Return updated statistics
    const pullVotes = await Vote.countDocuments({ choice: 'pull' });
    const nothingVotes = await Vote.countDocuments({ choice: 'nothing' });
    
    res.json({
      success: true,
      pullLeverVotes: pullVotes,
      doNothingVotes: nothingVotes,
      totalVotes: pullVotes + nothingVotes
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

// Get all reflections
app.get('/api/reflections', async (req, res) => {
  try {
    const reflections = await Reflection.find()
      .sort({ timestamp: -1 })
      .limit(50); // Limit to last 50 reflections
    
    res.json(reflections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reflections' });
  }
});

// Submit a reflection
app.post('/api/reflections', async (req, res) => {
  try {
    const { text, choice } = req.body;

    if (!text || text.length > 500) {
      return res.status(400).json({ error: 'Invalid reflection text' });
    }

    const reflection = new Reflection({
      text,
      choice
    });

    await reflection.save();
    res.json(reflection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit reflection' });
  }
});

// Vote on a reflection
app.post('/api/reflections/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'up' or 'down'

    const reflection = await Reflection.findById(id);
    if (!reflection) {
      return res.status(404).json({ error: 'Reflection not found' });
    }

    if (voteType === 'up') {
      reflection.upvotes += 1;
    } else if (voteType === 'down') {
      reflection.downvotes += 1;
    }

    await reflection.save();
    res.json(reflection);
  } catch (error) {
    res.status(500).json({ error: 'Failed to vote on reflection' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Export for use in other files
export { Vote, Reflection };