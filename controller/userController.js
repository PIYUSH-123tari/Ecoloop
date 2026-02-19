const User = require("../model/User");
const {v4:uuidv4}=require('uuid');
const bcrypt = require("bcrypt"); 

const nodemailer = require("nodemailer");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ecoloop229@gmail.com",   // 👈 your gmail
    pass: "auessmdhdfhsbveb"      // 👈 Gmail App Password (NOT normal password)
  }
});


const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, region_Id } = req.body;


   // Check if user already exists (email OR phone)
    const userExists = await User.findOne({
      $or: [{ email }, { phone }]
    });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
   const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userId:uuidv4(),
      name,
      email,
      phone,
      password: hashedPassword,
      region_Id
    });

     // ✅ SEND EMAIL HERE
    await transporter.sendMail({
     from: "ecoloop229@gmail.com",
      to: email,
      subject: "Welcome to EcoLoop ♻",
      text: `Hello ${name},

Thank you for registering with EcoLoop ♻.

Together we make the planet cleaner 🌍

- Team EcoLoop`
    });

    res.status(201).json({
      message: "User registered successfully",
       user: {
      userId: user.userId,
      name: user.name,
      email: user.email,
      region_Id:user.region_Id
             }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const logoutUser = (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
}

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }
const findUser = await User.findOne({ email });
if (!findUser) {
  return res.status(401).json({ message: "Invalid email or password" });
}

const isMatch = await bcrypt.compare(password, findUser.password);
if (!isMatch) {
  return res.status(401).json({ message: "Invalid email or password" });
}
    return res.status(200).json({ message: "Login successful",  
    user: {
    userId: findUser.userId,
    name: findUser.name,
    email: findUser.email,
    region_Id: findUser.region_Id
      } 
});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { registerUser, logoutUser, loginController };