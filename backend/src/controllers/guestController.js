import Guest from '../models/Guest.js';
import Customer from '../models/Customer.js';

export const getAllGuests = async (req, res) => {
  try {
    const guests = await Guest.find().populate('customer', 'name email cabinNumber').sort('-requestedAt');
    
    res.json({
      success: true,
      count: guests.length,
      guests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getTodayGuests = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const guests = await Guest.find({
      requestedAt: { $gte: startOfDay }
    }).populate('customer', 'name email cabinNumber').sort('-requestedAt');

    res.json({
      success: true,
      count: guests.length,
      guests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const createGuest = async (req, res) => {
  try {
    const { customerId, guestName, expectedTime, addedBy } = req.body;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const guest = await Guest.create({
      customer: customerId,
      customerName: customer.name,
      cabinNumber: customer.cabinNumber,
      guestName,
      expectedTime,
      addedBy
    });

    res.status(201).json({
      success: true,
      guest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const completeGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        completedAt: new Date()
      },
      { new: true }
    );

    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest not found'
      });
    }

    res.json({
      success: true,
      guest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};