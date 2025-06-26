import User from '../models/User.js';

const BADGES = {
  FAST_SOLVER: {
    name: 'Fast Solver',
    description: 'Solved a problem in under 1 minute',
    icon: '🏃‍♂️',
    condition: (user, context) => {
      return context.solveTime && context.solveTime < 60000; // 1 minute
    }
  },
  
  BUG_HUNTER: {
    name: 'Bug Hunter',
    description: 'Made 5+ wrong attempts before solving',
    icon: '🐞',
    condition: (user, context) => {
      return context.attempts && context.attempts >= 5;
    }
  },
  
  STREAK_MASTER: {
    name: 'Streak Master',
    description: 'Won 3 games in a row',
    icon: '🔥',
    condition: (user, context) => {
      return user.currentStreak >= 3;
    }
  },
  
  FIRST_BLOOD: {
    name: 'First Blood',
    description: 'First to solve in a competition',
    icon: '🩸',
    condition: (user, context) => {
      return context.isFirstSolver === true;
    }
  },
  
  PERFECTIONIST: {
    name: 'Perfectionist',
    description: 'Solved on first attempt',
    icon: '💎',
    condition: (user, context) => {
      return context.attempts === 1;
    }
  },
  
  NIGHT_OWL: {
    name: 'Night Owl',
    description: 'Solved a problem between 12 AM - 6 AM',
    icon: '🦉',
    condition: (user, context) => {
      const hour = new Date().getHours();
      return hour >= 0 && hour < 6;
    }
  },
  
  EARLY_BIRD: {
    name: 'Early Bird',
    description: 'Solved a problem between 5 AM - 8 AM',
    icon: '🐦',
    condition: (user, context) => {
      const hour = new Date().getHours();
      return hour >= 5 && hour < 8;
    }
  },
  
  POLYGLOT: {
    name: 'Polyglot',
    description: 'Used 3+ different programming languages',
    icon: '🗣️',
    condition: (user, context) => {
      return user.statistics.languagesUsed.length >= 3;
    }
  },
  
  CENTURY: {
    name: 'Century',
    description: 'Solved 100 problems',
    icon: '💯',
    condition: (user, context) => {
      const totalSolved = user.statistics.problemsSolved.easy + 
                         user.statistics.problemsSolved.medium + 
                         user.statistics.problemsSolved.hard;
      return totalSolved >= 100;
    }
  },
  
  VETERAN: {
    name: 'Veteran',
    description: 'Played 50+ games',
    icon: '🎖️',
    condition: (user, context) => {
      return user.gamesPlayed >= 50;
    }
  },
  
  CHAMPION: {
    name: 'Champion',
    description: 'Won 25+ games',
    icon: '👑',
    condition: (user, context) => {
      return user.gamesWon >= 25;
    }
  },
  
  SPEED_DEMON: {
    name: 'Speed Demon',
    description: 'Average solve time under 5 minutes',
    icon: '⚡',
    condition: (user, context) => {
      return user.statistics.averageSolveTime && user.statistics.averageSolveTime < 300000; // 5 minutes
    }
  }
};

class BadgeSystem {
  static async checkAndAwardBadges(userId, context = {}) {
    try {
      const user = await User.findById(userId);
      if (!user) return [];

      const newBadges = [];
      const existingBadgeNames = user.badges.map(badge => badge.name);

      for (const [key, badge] of Object.entries(BADGES)) {
        // Skip if user already has this badge
        if (existingBadgeNames.includes(badge.name)) {
          continue;
        }

        // Check if user meets the condition for this badge
        if (badge.condition(user, context)) {
          const newBadge = {
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            earnedAt: new Date()
          };

          user.addBadge(newBadge);
          newBadges.push(newBadge);
        }
      }

      if (newBadges.length > 0) {
        await user.save();
      }

      return newBadges;
    } catch (error) {
      console.error('Error checking badges:', error);
      return [];
    }
  }

  static async updateUserLanguageStats(userId, language) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      const existingLang = user.statistics.languagesUsed.find(l => l.language === language);
      if (existingLang) {
        existingLang.count++;
      } else {
        user.statistics.languagesUsed.push({ language, count: 1 });
      }

      await user.save();
    } catch (error) {
      console.error('Error updating language stats:', error);
    }
  }

  static async updateSolveTime(userId, solveTime) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      if (!user.statistics.fastestSolve || solveTime < user.statistics.fastestSolve) {
        user.statistics.fastestSolve = solveTime;
      }

      // Update average solve time
      const totalSolved = user.statistics.problemsSolved.easy + 
                         user.statistics.problemsSolved.medium + 
                         user.statistics.problemsSolved.hard;
      
      if (totalSolved > 0) {
        const currentAverage = user.statistics.averageSolveTime || 0;
        user.statistics.averageSolveTime = ((currentAverage * (totalSolved - 1)) + solveTime) / totalSolved;
      } else {
        user.statistics.averageSolveTime = solveTime;
      }

      await user.save();
    } catch (error) {
      console.error('Error updating solve time:', error);
    }
  }

  static getAllBadges() {
    return Object.values(BADGES);
  }

  static getBadgeByName(name) {
    return Object.values(BADGES).find(badge => badge.name === name);
  }
}

export default BadgeSystem;
