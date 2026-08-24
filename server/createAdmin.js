require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("./src/config/db");
const User = require("./src/models/User");

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: "admin@careflow.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@12345", 10);

    await User.create({
      name: "CareFlow Admin",
      email: "admin@careflow.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
    console.log("Email: admin@careflow.com");
    console.log("Password: Admin@12345");

    process.exit(0);
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exit(1);
  }
};

createAdmin();