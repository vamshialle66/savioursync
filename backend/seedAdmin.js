// seedAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

const MONGO_URI = process.env.MONGO_URI

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const hashedPassword = await bcrypt.hash("testing", 10);

    const admin = await User.create({
      username: "Parth",
      email: "parth@app.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created successfully:");
    console.log({
      username: admin.username,
      email: admin.email,
      password: "Admin@123 (hashed in DB)",
      role: admin.role,
    });

    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

seedAdmin();
