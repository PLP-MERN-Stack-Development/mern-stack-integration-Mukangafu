import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js"; // adjust path if needed

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/your_db_name";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected");

    const email = "dannymuturi99@gmal.com"; // change to your preferred admin email
    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("DanAdmin@123", 10); // change password here

    const admin = new User({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin user created successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
