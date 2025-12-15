import Order from '../models/Order.js';
import Customer from '../models/Customer.js';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customer', 'name email cabinNumber').sort('-requestedAt');
    
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getTodayOrders = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      requestedAt: { $gte: startOfDay }
    }).populate('customer', 'name email cabinNumber').sort('-requestedAt');

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const createOrder = async (req, res) => {
  
  try {
    const { customerId, type, addedBy } = req.body;
    console.log('Extracted:', { customerId, type, addedBy });

    const customer = await Customer.findById(customerId);
    console.log('Customer found:', customer ? customer.name : 'Not found');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    console.log('Customer todayChaiCoffeeUsed:', customer.todayChaiCoffeeUsed);
    if (customer.todayChaiCoffeeUsed >= 1) {
      return res.status(400).json({
        success: false,
        message: 'Daily chai/coffee limit reached'
      });
    }

    const order = await Order.create({
      customer: customerId,
      customerName: customer.name,
      cabinNumber: customer.cabinNumber,
      type,
      addedBy
    });

    customer.todayChaiCoffeeUsed += 1;
    await customer.save();
    console.log('Customer updated');

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
export const completeOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        completedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};