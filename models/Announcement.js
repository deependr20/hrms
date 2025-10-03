import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['general', 'urgent', 'event', 'policy', 'celebration'],
    default: 'general',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  publishDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
  targetAudience: {
    type: String,
    enum: ['all', 'department', 'specific'],
    default: 'all',
  },
  departments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  }],
  specificEmployees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  }],
  attachments: [{
    name: String,
    url: String,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'expired', 'archived'],
    default: 'draft',
  },
  views: [{
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    viewedAt: { type: Date, default: Date.now },
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  }],
  comments: [{
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    comment: String,
    commentedAt: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

export default mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);

