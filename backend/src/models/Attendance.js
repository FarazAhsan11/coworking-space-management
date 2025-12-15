import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
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
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date
  },
  hoursSpent: {
    type: Number
  },
  addedBy: {
    type: String,
    enum: ['customer', 'office-boy'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Attendance', attendanceSchema);