import express from 'express';
import Problem from '../models/Problem.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import codeExecutor from '../utils/codeExecutor.js';
import BadgeSystem from '../utils/badgeSystem.js';
import { authenticateToken } from '../middleware/auth.js';
import { io } from '../server.js';

const router = express.Router();

// Submit solution for a problem
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { problemId, roomId, code, language, languageId } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    // Get problem details
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Run test cases
    const testResults = await codeExecutor.runTestCases(
      code,
      language,
      problem.testCases
    );

    const submission = {
      userId: req.userId,
      problemId,
      roomId,
      code,
      language,
      languageId,
      status: testResults.allPassed ? 'accepted' : 'wrong_answer',
      testResults,
      submittedAt: new Date(),
      executionTime: testResults.results.reduce((sum, r) => sum + (r.executionTime || 0), 0),
      testCasesPassed: testResults.passedTests,
      totalTestCases: testResults.totalTests
    };

    // If this is a room submission, update room data
    if (roomId) {
      const room = await Room.findOne({ roomId });
      if (room) {
        const participant = room.participants.find(p => p.user.toString() === req.userId);
        if (participant) {
          participant.submissions.push(submission);
          
          // If all test cases passed, mark as solved
          if (testResults.allPassed && !participant.solvedAt) {
            const solveTime = Date.now() - new Date(room.timer.startTime).getTime();
            participant.solvedAt = new Date();
            participant.score = problem.getPoints();

            // Check if this is the first solver
            const isFirstSolver = !room.participants.some(p =>
              p.user.toString() !== req.userId && p.solvedAt
            );

            // Update user statistics
            const user = await User.findById(req.userId);
            if (user) {
              user.totalPoints += participant.score;
              user.statistics.problemsSolved[problem.difficulty.toLowerCase()]++;
              user.updateLevel();
              await user.save();

              // Update language statistics
              await BadgeSystem.updateUserLanguageStats(req.userId, language);

              // Update solve time statistics
              await BadgeSystem.updateSolveTime(req.userId, solveTime);

              // Check for new badges
              const newBadges = await BadgeSystem.checkAndAwardBadges(req.userId, {
                solveTime,
                attempts: participant.submissions.length,
                isFirstSolver,
                difficulty: problem.difficulty
              });

              if (newBadges.length > 0) {
                // Broadcast new badges to room
                io.to(roomId).emit('badges_earned', {
                  userId: req.userId,
                  username: req.user.username,
                  badges: newBadges
                });
              }
            }
          }
          
          await room.save();
          
          // Broadcast submission to room
          io.to(roomId).emit('submission_result', {
            userId: req.userId,
            username: req.user.username,
            status: submission.status,
            testCasesPassed: testResults.passedTests,
            totalTestCases: testResults.totalTests,
            executionTime: submission.executionTime,
            solved: testResults.allPassed
          });
        }
      }
    }

    res.json({
      message: 'Submission processed',
      submission: {
        status: submission.status,
        testResults: {
          totalTests: testResults.totalTests,
          passedTests: testResults.passedTests,
          allPassed: testResults.allPassed,
          results: testResults.results.map(r => ({
            input: r.input,
            expectedOutput: r.expectedOutput,
            actualOutput: r.actualOutput,
            passed: r.passed,
            executionTime: r.executionTime,
            error: r.error
          }))
        },
        executionTime: submission.executionTime
      }
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Failed to process submission' });
  }
});

// Test code execution (without saving)
router.post('/test', authenticateToken, async (req, res) => {
  try {
    const { code, language, input = '' } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const result = await codeExecutor.executeCode({
      code,
      language,
      input
    });

    res.json({
      output: result.stdout,
      error: result.stderr || result.compileOutput,
      executionTime: result.time,
      memory: result.memory,
      status: result.status.description,
      success: result.isSuccess
    });
  } catch (error) {
    console.error('Test execution error:', error);
    res.status(500).json({ error: 'Failed to execute code' });
  }
});

// Get submission history for a user
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, problemId, status } = req.query;
    
    // This would typically come from a submissions collection
    // For now, we'll return a placeholder response
    res.json({
      submissions: [],
      pagination: {
        current: page,
        pages: 0,
        total: 0
      }
    });
  } catch (error) {
    console.error('Get submission history error:', error);
    res.status(500).json({ error: 'Failed to get submission history' });
  }
});

export default router;
