const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb://127.0.0.1:27017/payroll");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model("User", UserSchema);

async function createAdmin() {
  try {
    await User.deleteMany({
      email: "admin@gmail.com",
    });

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "superadmin",
    });

    console.log("✅ ADMIN CREATED");
    console.log("Email: admin@gmail.com");
    console.log("Password: admin123");

    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
}

createAdmin();