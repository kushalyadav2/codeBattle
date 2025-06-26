import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  level: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    default: 'Bronze'
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  gamesWon: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  maxStreak: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    description: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  statistics: {
    fastestSolve: {
      type: Number,
      default: null // in seconds
    },
    averageSolveTime: {
      type: Number,
      default: null
    },
    problemsSolved: {
      easy: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      hard: { type: Number, default: 0 }
    },
    languagesUsed: [{
      language: String,
      count: Number
    }]
  },
  preferences: {
    preferredLanguage: {
      type: String,
      default: 'javascript'
    },
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark'
    }
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update level based on points
userSchema.methods.updateLevel = function() {
  const points = this.totalPoints;
  if (points >= 10000) this.level = 'Diamond';
  else if (points >= 5000) this.level = 'Platinum';
  else if (points >= 2000) this.level = 'Gold';
  else if (points >= 500) this.level = 'Silver';
  else this.level = 'Bronze';
};

// Add badge method
userSchema.methods.addBadge = function(badgeData) {
  const existingBadge = this.badges.find(badge => badge.name === badgeData.name);
  if (!existingBadge) {
    this.badges.push(badgeData);
  }
};

export default mongoose.model('User', userSchema);
