const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Donor = require("../models/Donor");
const verifyToken = require("../middleware/verifyToken");
const DonorApplication = require("../models/DonorApplication");

// Get current user info using token
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get complete profile for logged-in user (user + donor info)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // Fetch user
    const user = await User.findById(req.user.id).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch donor data if exists
    const donor = await Donor.findOne({ userId: req.user.id })
      .populate("userId", "username email");

    if (!donor) {
      // User exists but not registered as donor
      return res.json({
        success: true,
        user,
        donor: null,
        applicationStatus: null,
      });
    }

    // Fetch donor application status
    const application = await DonorApplication.findOne({ userId: req.user.id });

    // Calculate donor stats
    const donorStats = {
      totalDonations: donor.donationHistory?.length || 0,
      totalVolume: donor.donationHistory?.reduce((sum, d) => sum + (d.volume || 0), 0) || 0,
      lastDonation: donor.donationHistory?.length
        ? new Date(Math.max(...donor.donationHistory.map((d) => new Date(d.date)))).toLocaleDateString()
        : "N/A",
      isVerified: !!donor.verifiedAt,
      verifiedDate: donor.verifiedAt || null,
    };

    // Return complete donor profile (including medical history, all donations, etc.)
    const completeDonor = {
      id: donor._id,
      name: donor.userId?.username || "Unnamed",
      email: donor.userId?.email || user.email,
      phone: donor.phone || user.phone || null,
      bloodGroup: donor.bloodGroup,
      age: donor.age,
      weight: donor.weight,
      location: donor.location,
      locationCoords: donor.locationCoords,
      lastDonation: donor.lastDonation,
      donationHistory: donor.donationHistory?.map((d) => ({
        type: d.type,
        date: d.date,
        location: d.location,
        volume: d.volume,
      })) || [],
      medicalHistory: donor.medicalHistory?.map((m) => ({
        condition: m.condition,
        diagnosisDate: m.diagnosisDate,
        status: m.status,
        notes: m.notes,
      })) || [],
      stats: donorStats,
      verifiedAt: donor.verifiedAt,
      createdAt: donor.createdAt,
      updatedAt: donor.updatedAt,
    };

    res.json({
      success: true,
      user,
      donor: completeDonor,
      applicationStatus: application?.status || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user by ID (protected route) - only allow users to access their own data
router.get("/:id", verifyToken, async (req, res) => {
  try {
    // Prevent users from accessing other users' sensitive data
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(req.params.id).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    // Validate input
    if (!username || !email) {
      return res.status(400).json({ message: "Username and email are required" });
    }

    // Check if email already exists (excluding current user)
    const existingEmail = await User.findOne({
      email,
      _id: { $ne: req.user.id },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, phone },
      { new: true }
    ).select("-password -resetPasswordToken -resetPasswordExpires");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update donor profile
router.put("/donor-profile", verifyToken, async (req, res) => {
  try {
    const { age, weight, phone, location } = req.body;

    const donor = await Donor.findOneAndUpdate(
      { userId: req.user.id },
      { age, weight, phone, location },
      { new: true }
    ).populate("userId", "username email");

    if (!donor) {
      return res.status(404).json({ message: "Donor profile not found" });
    }

    res.json({ success: true, message: "Donor profile updated", donor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;