import mongoose from 'mongoose';

const PolicySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['hr', 'it', 'security', 'compliance', 'code-of-conduct', 'other'],
    required: true,
  },
  version: {
    type: Number,
    default: 1,
  },
  effectiveDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  applicableTo: {
    type: String,
    enum: ['all', 'department', 'specific'],
    default: 'all',
  },
  specificEmployees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  }],
  requiresAcknowledgment: {
    type: Boolean,
    default: true,
  },
  acknowledgments: [{
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    acknowledgedDate: Date,
    ipAddress: String,
  }],
  attachments: [{
    name: String,
    url: String,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
  approvedDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'archived', 'expired'],
    default: 'draft',
  },
  previousVersions: [{
    version: Number,
    content: String,
    effectiveDate: Date,
    archivedDate: Date,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Policy || mongoose.model('Policy', PolicySchema);

