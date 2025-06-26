import express from 'express';
import User from '../models/User.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get global leaderboard
router.get('/global', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const users = await User.find()
      .select('username level totalPoints gamesPlayed gamesWon currentStreak maxStreak avatar badges')
      .sort({ totalPoints: -1, gamesWon: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments();
    
    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      ...user.toObject(),
      rank: (page - 1) * limit + index + 1
    }));
    
    res.json({
      leaderboard,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get global leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get weekly leaderboard (based on recent activity)
router.get('/weekly', optionalAuth, async (req, res) => {
  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // For now, we'll use total points as weekly doesn't have separate tracking
    // In a real implementation, you'd have a separate weekly points system
    const users = await User.find({
      updatedAt: { $gte: oneWeekAgo }
    })
      .select('username level totalPoints gamesPlayed gamesWon currentStreak avatar')
      .sort({ totalPoints: -1 })
      .limit(50);
    
    const leaderboard = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1,
      weeklyPoints: user.totalPoints // Placeholder
    }));
    
    res.json({ leaderboard });
  } catch (error) {
    console.error('Get weekly leaderboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's rank and nearby users
router.get('/rank/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('username level totalPoints gamesPlayed gamesWon');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Count users with higher points to get rank
    const rank = await User.countDocuments({
      totalPoints: { $gt: user.totalPoints }
    }) + 1;
    
    // Get nearby users (5 above and 5 below)
    const nearbyUsers = await User.find()
      .select('username level totalPoints gamesPlayed gamesWon avatar')
      .sort({ totalPoints: -1 })
      .skip(Math.max(0, rank - 6))
      .limit(11);
    
    const nearbyLeaderboard = nearbyUsers.map((u, index) => ({
      ...u.toObject(),
      rank: Math.max(1, rank - 5) + index,
      isCurrentUser: u._id.toString() === userId
    }));
    
    res.json({
      userRank: rank,
      user: {
        ...user.toObject(),
        rank
      },
      nearbyUsers: nearbyLeaderboard
    });
  } catch (error) {
    console.error('Get user rank error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get top performers by category
router.get('/top/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = ['points', 'wins', 'streak', 'games'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    
    let sortField;
    switch (category) {
      case 'points':
        sortField = { totalPoints: -1 };
        break;
      case 'wins':
        sortField = { gamesWon: -1 };
        break;
      case 'streak':
        sortField = { maxStreak: -1 };
        break;
      case 'games':
        sortField = { gamesPlayed: -1 };
        break;
    }
    
    const users = await User.find()
      .select('username level totalPoints gamesPlayed gamesWon maxStreak avatar')
      .sort(sortField)
      .limit(20);
    
    const leaderboard = users.map((user, index) => ({
      ...user.toObject(),
      rank: index + 1
    }));
    
    res.json({ 
      category,
      leaderboard 
    });
  } catch (error) {
    console.error('Get top performers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
