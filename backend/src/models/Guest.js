import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  cabinNumber: {
    type: String,
    required: true
  },
  guestName: {
    type: String,
    required: [true, 'Please provide guest name']
  },
  expectedTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  addedBy: {
    type: String,
    enum: ['customer', 'office-boy'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Guest', guestSchema);