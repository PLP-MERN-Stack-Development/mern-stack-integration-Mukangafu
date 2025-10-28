// server/seedCategories.js
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Category from "./models/Category.js";

dotenv.config();

const categories = [
  "Technology",
  "Lifestyle",
  "Travel",
  "Health",
  "Finance",
  "Food",
  "Education",
  "Entertainment",
  "Sports",
  "Fashion",
  "Politics",
  "Business",
  "Science",
  "Culture",
  "Environment",
].map((name) => ({ name }));

const run = async () => {
  try {
    await connectDB();
    await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log(`✅ Inserted ${categories.length} categories.`);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding categories:", err);
    process.exit(1);
  }
};

run();
