import mongoose from "mongoose";
import Customer from "../models/Customer.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    scheduleDailyReset();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const scheduleDailyReset = () => {
  const now = new Date();
  const night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0
  );

  const msToMidnight = night.getTime() - now.getTime();

  setTimeout(async () => {
    try {
      await Customer.updateMany({}, { todayChaiCoffeeUsed: 0 });
      console.log("Daily chai/coffee usage reset completed");

      scheduleDailyReset();
    } catch (error) {
      console.error("Error resetting daily usage:", error.message);
    }
  }, msToMidnight);
};

export default connectDB;
