import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  checkIn: {
    type: Date,
  },
  checkOut: {
    type: Date,
  },
  checkInStatus: {
    type: String,
    enum: ['early', 'on-time', 'late'],
    default: 'on-time',
  },
  checkOutStatus: {
    type: String,
    enum: ['early', 'on-time', 'late'],
    default: 'on-time',
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'late', 'on-leave', 'holiday', 'weekend', 'in-progress'],
    default: 'absent',
  },
  workHours: {
    type: Number,
    default: 0,
  },
  overtime: {
    type: Number,
    default: 0,
  },
  shift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shift',
  },
  location: {
    checkIn: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
    checkOut: {
      latitude: Number,
      longitude: Number,
      address: String,
    },
  },
  remarks: {
    type: String,
  },
  isManualEntry: {
    type: Boolean,
    default: false,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
}, {
  timestamps: true,
});

// Compound index for employee and date
AttendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);

