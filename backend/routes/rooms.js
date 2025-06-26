import express from 'express';
import { randomBytes } from 'crypto';
import Room from '../models/Room.js';
import Problem from '../models/Problem.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all active rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ 
      status: { $in: ['waiting', 'starting'] },
      'settings.isPrivate': false 
    })
    .populate('host', 'username level avatar')
    .populate('participants.user', 'username level avatar')
    .select('roomId name host participants maxParticipants difficulty status settings')
    .sort({ createdAt: -1 });
    
    res.json({ rooms });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new room
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, maxParticipants = 4, difficulty = 'Easy', settings = {} } = req.body;
    
    const roomId = randomBytes(4).toString('hex').toUpperCase();
    
    const room = new Room({
      roomId,
      name,
      host: req.userId,
      maxParticipants,
      difficulty,
      settings: {
        timeLimit: 1800000, // 30 minutes
        isPrivate: false,
        allowSpectators: true,
        autoStart: false,
        ...settings
      }
    });
    
    // Add host as first participant
    room.participants.push({
      user: req.userId,
      isReady: false
    });
    
    await room.save();
    await room.populate('host', 'username level avatar');
    await room.populate('participants.user', 'username level avatar');
    
    res.status(201).json({
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific room
router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })
      .populate('host', 'username level avatar')
      .populate('participants.user', 'username level avatar')
      .populate('spectators.user', 'username level avatar')
      .populate('problem');
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start room (host only)
router.post('/:roomId/start', authenticateToken, async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    if (room.host.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only host can start the room' });
    }
    
    if (room.participants.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 participants to start' });
    }
    
    // Get random problem based on difficulty
    const problemCount = await Problem.countDocuments({ 
      difficulty: room.difficulty, 
      isActive: true 
    });
    
    if (problemCount === 0) {
      return res.status(400).json({ error: 'No problems available for this difficulty' });
    }
    
    const randomIndex = Math.floor(Math.random() * problemCount);
    const problem = await Problem.findOne({ 
      difficulty: room.difficulty, 
      isActive: true 
    }).skip(randomIndex);
    
    room.problem = problem._id;
    room.status = 'starting';
    room.timer.startTime = new Date(Date.now() + 10000); // 10 second countdown
    room.timer.endTime = new Date(Date.now() + 10000 + room.settings.timeLimit);
    
    await room.save();
    
    res.json({
      message: 'Room starting',
      room,
      problem: {
        id: problem._id,
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        examples: problem.examples,
        constraints: problem.constraints,
        starterCode: problem.starterCode
      }
    });
  } catch (error) {
    console.error('Start room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join room
router.post('/:roomId/join', authenticateToken, async (req, res) => {
  try {
    const { asSpectator = false } = req.body;
    const room = await Room.findOne({ roomId: req.params.roomId });
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    if (room.status !== 'waiting') {
      return res.status(400).json({ error: 'Room is not accepting new participants' });
    }
    
    let success = false;
    if (asSpectator) {
      success = room.addSpectator(req.userId);
    } else {
      success = room.addParticipant(req.userId);
    }
    
    if (!success) {
      return res.status(400).json({ 
        error: asSpectator ? 'Cannot join as spectator' : 'Room is full or you are already in the room' 
      });
    }
    
    await room.save();
    await room.populate('participants.user', 'username level avatar');
    await room.populate('spectators.user', 'username level avatar');
    
    res.json({
      message: `Joined room as ${asSpectator ? 'spectator' : 'participant'}`,
      room
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
