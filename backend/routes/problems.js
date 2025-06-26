import express from 'express';
import Problem from '../models/Problem.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all problems (with optional filtering)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { difficulty, category, page = 1, limit = 20 } = req.query;
    
    const filter = { isActive: true };
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    
    const problems = await Problem.find(filter)
      .select('title difficulty category tags solveCount successRate')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Problem.countDocuments(filter);
    
    res.json({
      problems,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get problems error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get random problem by difficulty
router.get('/random', async (req, res) => {
  try {
    const { difficulty = 'Easy' } = req.query;
    
    const count = await Problem.countDocuments({ difficulty, isActive: true });
    const random = Math.floor(Math.random() * count);
    
    const problem = await Problem.findOne({ difficulty, isActive: true })
      .skip(random)
      .select('-testCases -editorial');
    
    if (!problem) {
      return res.status(404).json({ error: 'No problems found' });
    }
    
    res.json({ problem });
  } catch (error) {
    console.error('Get random problem error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific problem
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .select('-testCases'); // Hide test cases from public view
    
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    
    res.json({ problem });
  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new problem (admin only for now)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const problemData = req.body;
    problemData.createdBy = req.userId;
    
    const problem = new Problem(problemData);
    await problem.save();
    
    res.status(201).json({ 
      message: 'Problem created successfully',
      problem 
    });
  } catch (error) {
    console.error('Create problem error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
