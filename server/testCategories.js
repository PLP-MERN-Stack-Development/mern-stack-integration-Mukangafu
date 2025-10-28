import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "./models/Category.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected to:", mongoose.connection.name);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();

  try {
    const categories = await Category.find(); // no sorting
    console.log(`Categories found: ${categories.length}`);
    console.log(categories);
  } catch (err) {
    console.error("❌ Error fetching categories:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

run();
