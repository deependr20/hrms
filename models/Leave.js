import mongoose from 'mongoose';

const LeaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  leaveType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LeaveType',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  numberOfDays: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  approvedDate: {
    type: Date,
  },
  rejectionReason: {
    type: String,
  },
  attachments: [{
    name: String,
    url: String,
  }],
  isHalfDay: {
    type: Boolean,
    default: false,
  },
  halfDaySession: {
    type: String,
    enum: ['first-half', 'second-half'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Leave || mongoose.model('Leave', LeaveSchema);

