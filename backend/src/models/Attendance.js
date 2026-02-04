const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    default: 'present'
  },
  markedBy: {
    type: String,
    enum: ['fingerprint', 'manual', 'teacher'],
    default: 'fingerprint'
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate attendance on same day
attendanceSchema.index({ student: 1, class: 1, date: 1 }, { unique: true });

// Index for faster queries
attendanceSchema.index({ date: -1 });
attendanceSchema.index({ class: 1, date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
