const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started'
  },
  code: {
    type: String,
    default: ''
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

UserProgressSchema.index({ userId: 1, exerciseId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);