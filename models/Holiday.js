import mongoose from 'mongoose';

const HolidaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ['public', 'optional', 'restricted'],
    default: 'public',
  },
  description: {
    type: String,
  },
  applicableTo: {
    type: String,
    enum: ['all', 'specific-locations'],
    default: 'all',
  },
  locations: [String],
  year: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Holiday || mongoose.model('Holiday', HolidaySchema);

