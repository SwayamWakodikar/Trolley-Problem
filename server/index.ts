// server/index.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Allow all origins for now (you can restrict later)
app.use(cors({
  origin: true, // Allows all origins temporarily for testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/trolley-problem';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Vote Schema
const voteSchema = new mongoose.Schema({
  choice: { type: String, enum: ['pull', 'nothing'], required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
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

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Trolley Problem API is running',
    timestamp: new Date().toISOString()
  });
});

// Get vote statistics
app.get('/api/votes', async (req, res) => {
  try {
    console.log('GET /api/votes - Fetching vote statistics');
    const pullVotes = await Vote.countDocuments({ choice: 'pull' });
    const nothingVotes = await Vote.countDocuments({ choice: 'nothing' });
    
    const result = {
      pullLeverVotes: pullVotes,
      doNothingVotes: nothingVotes,
      totalVotes: pullVotes + nothingVotes
    };
    
    console.log('Vote statistics:', result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// Submit a vote
app.post('/api/votes', async (req, res) => {
  try {
    const { choice } = req.body;
    console.log('POST /api/votes - Received vote:', choice);
    
    if (!choice || !['pull', 'nothing'].includes(choice)) {
      return res.status(400).json({ error: 'Invalid choice. Must be "pull" or "nothing"' });
    }

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Optional: Check if this IP has already voted
    const existingVote = await Vote.findOne({ ipAddress });
    if (existingVote) {
      console.log('IP already voted:', ipAddress);
      return res.status(400).json({ error: 'You have already voted' });
    }

    const vote = new Vote({
      choice,
      ipAddress,
      userAgent
    });

    await vote.save();
    console.log('Vote saved successfully');
    
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
    console.error('Error submitting vote:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

// Get all reflections
app.get('/api/reflections', async (req, res) => {
  try {
    console.log('GET /api/reflections - Fetching reflections');
    const reflections = await Reflection.find()
      .sort({ timestamp: -1 })
      .limit(50);
    
    console.log(`Found ${reflections.length} reflections`);
    res.json(reflections);
  } catch (error) {
    console.error('Error fetching reflections:', error);
    res.status(500).json({ error: 'Failed to fetch reflections' });
  }
});

// Submit a reflection
app.post('/api/reflections', async (req, res) => {
  try {
    const { text, choice } = req.body;
    console.log('POST /api/reflections - Received:', { text: text?.substring(0, 50), choice });

    if (!text || text.length > 500) {
      return res.status(400).json({ error: 'Invalid reflection text. Must be 1-500 characters.' });
    }

    if (!choice || !['pull', 'nothing'].includes(choice)) {
      return res.status(400).json({ error: 'Invalid choice. Must be "pull" or "nothing"' });
    }

    const reflection = new Reflection({
      text,
      choice
    });

    await reflection.save();
    console.log('Reflection saved successfully');
    res.json(reflection);
  } catch (error) {
    console.error('Error submitting reflection:', error);
    res.status(500).json({ error: 'Failed to submit reflection' });
  }
});

// Vote on a reflection
app.post('/api/reflections/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body;
    
    console.log(`POST /api/reflections/${id}/vote - Vote type:`, voteType);

    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid vote type. Must be "up" or "down"' });
    }

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
    console.log('Reflection vote updated');
    res.json(reflection);
  } catch (error) {
    console.error('Error voting on reflection:', error);
    res.status(500).json({ error: 'Failed to vote on reflection' });
  }
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.method, req.path);
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

export { Vote, Reflection };