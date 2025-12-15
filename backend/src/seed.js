
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from './models/Customer.js';

dotenv.config();

const seedCustomers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');

    
    await Customer.deleteMany({});
    console.log('Cleared existing customers');

    
    const customers = await Customer.create([
      {
        name: 'John Doe',
        email: 'john@workspace.com',
        password: 'password123',
        cabinNumber: '4',
        todayChaiCoffeeUsed: 0,
        isCheckedIn: false,
      },
      {
        name: 'Sara Ali',
        email: 'sara@workspace.com',
        password: 'password123',
        cabinNumber: '7',
        todayChaiCoffeeUsed: 0,
        isCheckedIn: false,
      },
      {
        name: 'Ahmed Khan',
        email: 'ahmed@workspace.com',
        password: 'password123',
        cabinNumber: '12',
        todayChaiCoffeeUsed: 0,
        isCheckedIn: false,
      },
    ]);

    console.log('Demo customers created:');
    customers.forEach((c) => {
      console.log(`- ${c.name} (${c.email}) - Cabin ${c.cabinNumber}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedCustomers();