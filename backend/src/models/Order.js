import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['chai', 'coffee'],
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

export default mongoose.model('Order', orderSchema);