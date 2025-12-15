import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  cabinNumber: {
    type: String,
    required: [true, 'Please provide a cabin number']
  },
  todayChaiCoffeeUsed: {
    type: Number,
    default: 0
  },
  isCheckedIn: {
    type: Boolean,
    default: false
  },
  lastCheckIn: {
    type: Date
  },
  lastCheckOut: {
    type: Date
  }
}, {
  timestamps: true
});


customerSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;  
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


customerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('Customer', customerSchema);