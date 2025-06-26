import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  }
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    enum: ['Array', 'String', 'Math', 'Dynamic Programming', 'Graph', 'Tree', 'Sorting', 'Searching', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  constraints: {
    type: String,
    default: ''
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  testCases: [testCaseSchema],
  timeLimit: {
    type: Number,
    default: 2000 // in milliseconds
  },
  memoryLimit: {
    type: Number,
    default: 256 // in MB
  },
  points: {
    easy: { type: Number, default: 10 },
    medium: { type: Number, default: 20 },
    hard: { type: Number, default: 30 }
  },
  editorial: {
    solution: String,
    explanation: String,
    complexity: {
      time: String,
      space: String
    }
  },
  starterCode: {
    javascript: String,
    python: String,
    cpp: String,
    java: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  solveCount: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate points based on difficulty
problemSchema.methods.getPoints = function() {
  switch (this.difficulty) {
    case 'Easy': return this.points.easy;
    case 'Medium': return this.points.medium;
    case 'Hard': return this.points.hard;
    default: return 10;
  }
};

// Update success rate
problemSchema.methods.updateSuccessRate = function(totalAttempts, successfulAttempts) {
  this.successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0;
};

export default mongoose.model('Problem', problemSchema);
