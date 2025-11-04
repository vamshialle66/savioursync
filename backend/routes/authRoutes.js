// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// -----------------------
// Rate limiter for login
// -----------------------
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // max 5 attempts
  message: "Too many login attempts, please try again later",
});

// -----------------
// SIGNUP ROUTE
// -----------------
router.post(
  "/signup",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      let { username, email, password } = req.body;
      email = email.toLowerCase(); // ensure lowercase for consistency

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "Email already registered" });

      // Create user (pre-save hook will hash password)
      const user = await User.create({
        username,
        email,
        password,
        role: "user", // default role
      });

      // Generate JWT
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(201).json({
        token,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error during signup" });
    }
  }
);

// -----------------
// LOGIN ROUTE
// -----------------
router.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      let { email, password } = req.body;
      email = email.toLowerCase();

      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });

      // Compare password using model method
      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.json({
        token,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error during login" });
    }
  }
);
// -----------------------
// Forgot Password
// -----------------------
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during password reset request" });
  }
});

// -----------------------
// Reset Password
// -----------------------
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during password reset" });
  }
});

module.exports = router;
