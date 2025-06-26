import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  isReady: {
    type: Boolean,
    default: false
  },
  currentCode: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'javascript'
  },
  submissions: [{
    code: String,
    language: String,
    submittedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compilation_error']
    },
    executionTime: Number,
    testCasesPassed: Number,
    totalTestCases: Number
  }],
  score: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  },
  solvedAt: {
    type: Date,
    default: null
  }
});

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [participantSchema],
  maxParticipants: {
    type: Number,
    default: 4,
    min: 2,
    max: 8
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy'
  },
  status: {
    type: String,
    enum: ['waiting', 'starting', 'active', 'finished', 'cancelled'],
    default: 'waiting'
  },
  settings: {
    timeLimit: {
      type: Number,
      default: 1800000 // 30 minutes in milliseconds
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    allowSpectators: {
      type: Boolean,
      default: true
    },
    autoStart: {
      type: Boolean,
      default: false
    }
  },
  timer: {
    startTime: Date,
    endTime: Date,
    remainingTime: Number
  },
  spectators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  chat: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['message', 'system', 'submission'],
      default: 'message'
    }
  }],
  results: {
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rankings: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rank: Number,
      score: Number,
      solveTime: Number,
      submissions: Number
    }]
  }
}, {
  timestamps: true
});

// Get available spots
roomSchema.methods.getAvailableSpots = function() {
  return this.maxParticipants - this.participants.length;
};

// Check if user is participant
roomSchema.methods.isParticipant = function(userId) {
  return this.participants.some(p => p.user.toString() === userId.toString());
};

// Check if user is spectator
roomSchema.methods.isSpectator = function(userId) {
  return this.spectators.some(s => s.user.toString() === userId.toString());
};

// Add participant
roomSchema.methods.addParticipant = function(userId) {
  if (!this.isParticipant(userId) && this.getAvailableSpots() > 0) {
    this.participants.push({ user: userId });
    return true;
  }
  return false;
};

// Remove participant
roomSchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(p => p.user.toString() !== userId.toString());
};

// Add spectator
roomSchema.methods.addSpectator = function(userId) {
  if (!this.isSpectator(userId) && this.settings.allowSpectators) {
    this.spectators.push({ user: userId });
    return true;
  }
  return false;
};

// Check if all participants are ready
roomSchema.methods.allParticipantsReady = function() {
  return this.participants.length >= 2 && this.participants.every(p => p.isReady);
};

export default mongoose.model('Room', roomSchema);
