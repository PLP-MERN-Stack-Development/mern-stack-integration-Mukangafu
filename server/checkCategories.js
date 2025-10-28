// checkCategories.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Category from "./models/Category.js";

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    const cats = await Category.find();
    console.log("✅ Categories in DB:");
    console.log(cats.map(c => c.name));
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    process.exit();
  }
};

run();
