import Customer from '../models/Customer.js';
import { generateToken } from '../middleware/auth.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    
    const customer = await Customer.findOne({ email }).select('+password');

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

  
    const isMatch = await customer.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

  
    const token = generateToken(customer._id);

    res.json({
      success: true,
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        cabinNumber: customer.cabinNumber,
        todayChaiCoffeeUsed: customer.todayChaiCoffeeUsed,
        isCheckedIn: customer.isCheckedIn,
        lastCheckIn: customer.lastCheckIn,
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


export const getMe = async (req, res) => {
  try {
    const customer = req.customer;

    res.json({
      success: true,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        cabinNumber: customer.cabinNumber,
        todayChaiCoffeeUsed: customer.todayChaiCoffeeUsed,
        isCheckedIn: customer.isCheckedIn,
        lastCheckIn: customer.lastCheckIn,
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

export const register = async (req, res) => {
  try {
    const { name, email, password, cabinNumber } = req.body;
    const customerExists = await Customer.findOne({ email });

    if (customerExists) {
      return res.status(400).json({
        success: false,
        message: 'Customer already exists'
      });
    }
    const customer = await Customer.create({
      name,
      email,
      password,
      cabinNumber
    });
    const token = generateToken(customer._id);

    res.status(201).json({
      success: true,
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        cabinNumber: customer.cabinNumber,
        todayChaiCoffeeUsed: customer.todayChaiCoffeeUsed,
        isCheckedIn: customer.isCheckedIn
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