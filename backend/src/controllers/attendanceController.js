import Attendance from '../models/Attendance.js';
import Customer from '../models/Customer.js';

export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('customer', 'name email cabinNumber').sort('-checkInTime');
    
    res.json({
      success: true,
      count: attendance.length,
      attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({
      checkInTime: { $gte: startOfDay }
    }).populate('customer', 'name email cabinNumber').sort('-checkInTime');

    res.json({
      success: true,
      count: attendance.length,
      attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const checkIn = async (req, res) => {
  try {
    const { customerId, addedBy, checkInTime } = req.body;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    if (customer.isCheckedIn) {
      return res.status(400).json({
        success: false,
        message: 'Customer is already checked in'
      });
    }

    const time = checkInTime ? new Date(checkInTime) : new Date();

    const attendance = await Attendance.create({
      customer: customerId,
      customerName: customer.name,
      cabinNumber: customer.cabinNumber,
      checkInTime: time,
      addedBy
    });

    customer.isCheckedIn = true;
    customer.lastCheckIn = time;
    await customer.save();

    res.status(201).json({
      success: true,
      attendance,
      customer: {
        id: customer._id,
        isCheckedIn: customer.isCheckedIn,
        lastCheckIn: customer.lastCheckIn
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const checkOut = async (req, res) => {
  try {
    const { customerId, addedBy, checkOutTime } = req.body;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    if (!customer.isCheckedIn) {
      return res.status(400).json({
        success: false,
        message: 'Customer is not checked in'
      });
    }

    const time = checkOutTime ? new Date(checkOutTime) : new Date();

    const attendance = await Attendance.findOne({
      customer: customerId,
      checkOutTime: null
    }).sort('-checkInTime');

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'No active check-in found'
      });
    }

    const hoursSpent = (time - attendance.checkInTime) / (1000 * 60 * 60);

    attendance.checkOutTime = time;
    attendance.hoursSpent = Math.round(hoursSpent * 100) / 100;
    attendance.addedBy = addedBy;
    await attendance.save();

    customer.isCheckedIn = false;
    customer.lastCheckOut = time;
    await customer.save();

    res.json({
      success: true,
      attendance,
      customer: {
        id: customer._id,
        isCheckedIn: customer.isCheckedIn,
        lastCheckOut: customer.lastCheckOut
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};