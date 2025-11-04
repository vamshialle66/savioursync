// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const authMiddleware = require("../middleware/authMiddleware"); // verifies JWT & sets req.user
const adminMiddleware = require("../middleware/adminMiddleware"); // checks req.user.role === "admin"
const logActivity = require("../utils/activityLogger");
const User = require("../models/User");
const DonorApplication = require("../models/DonorApplication");
const Donor = require("../models/Donor");
const fs = require("fs");
const path = require("path");
const BLOODBANKS_FILE = path.join(__dirname, "../data/bloodbanks.json");
const HOSPITALS_FILE = path.join(__dirname, "../data/hospitals.json");

// -----------------------
// DASHBOARD STATS
// -----------------------
router.get("/dashboard", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalApplications = await DonorApplication.countDocuments();
    const pendingApplications = await DonorApplication.countDocuments({ status: "Pending" });

    res.json({ totalUsers, totalApplications, pendingApplications });
  } catch (err) {
    next(err);
  }
});

// -----------------------
// GET ALL USERS (pagination & search)
// -----------------------
router.get("/manage-users", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;
    const search = req.query.search || "";

    const query = search
      ? { $or: [{ username: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
      : {};

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ total, page, limit, users });
  } catch (err) {
    next(err);
  }
});

// -----------------------
// UPDATE USER
// -----------------------
router.patch(
  "/manage-users/:id",
  authMiddleware,
  adminMiddleware,
  [
    body("email").optional().isEmail().withMessage("Must be a valid email"),
    body("username").optional().isLength({ min: 1 }).withMessage("Username cannot be empty"),
    body("role").optional().isIn(["user", "admin"]).withMessage("Role must be user or admin"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const updates = {};
      ["email", "username", "role"].forEach((field) => {
        if (req.body[field] !== undefined) updates[field] = req.body[field];
      });

      const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select("-password");
      if (!updatedUser) return res.status(404).json({ message: "User not found" });

      logActivity("updated user", req.user.email, updatedUser.email);

      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

// -----------------------
// DELETE USER
// -----------------------
router.delete("/manage-users/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(req.params.id);

    logActivity("deleted user", req.user.email, user.email);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// -----------------------
// DONOR APPLICATIONS
// -----------------------
router.get("/applications", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 20;
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 20;

    const total = await DonorApplication.countDocuments({ status: "Pending" });
    const applications = await DonorApplication.find({ status: "Pending" })
      .populate("userId", "email username")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ appliedAt: -1 });

    res.json({ total, page, limit, applications });
  } catch (err) {
    next(err);
  }
});

router.patch("/verify-donor/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { status, adminNotes, bloodGroup, phone, weight, coordinates } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'Approved' or 'Rejected'" });
    }

    const application = await DonorApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (status === "Approved") {
      if (!bloodGroup || !phone || !weight || !coordinates?.length === 2) {
        return res.status(400).json({ message: "Missing required donor fields" });
      }

      const existingDonor = await Donor.findOne({ userId: application.userId });
      if (existingDonor) return res.status(400).json({ message: "Donor already exists" });

      const dob = new Date(application.dob);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
      }

      await Donor.create({
        userId: application.userId,
        age,
        bloodGroup,
        location: application.address,
        locationCoords: { type: "Point", coordinates },
        phone,
        weight,
        applicationId: application._id,
      });
    }

    application.status = status;
    application.adminNotes = adminNotes || "";
    await application.save();

    logActivity(`donor application ${status.toLowerCase()}`, req.user.email, application.userId.toString());

    res.json({ message: `Application ${status}`, application });
  } catch (err) {
    next(err);
  }
});

// -----------------------
// GET BLOODBANKS
// -----------------------
router.get("/manage-bloodbanks", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!fs.existsSync(BLOODBANKS_FILE)) {
      return res.status(200).json([]); // empty array if file doesn't exist
    }

    const data = JSON.parse(fs.readFileSync(BLOODBANKS_FILE, "utf-8"));
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// -----------------------
// ADD BLOODBANK
// -----------------------
router.post("/manage-bloodbanks", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { name, address, phone } = req.body;
    if (!name || !address || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bloodbanks = fs.existsSync(BLOODBANKS_FILE)
      ? JSON.parse(fs.readFileSync(BLOODBANKS_FILE, "utf-8"))
      : [];

    const newBloodbank = { id: Date.now().toString(), name, address, phone };
    bloodbanks.push(newBloodbank);

    fs.writeFileSync(BLOODBANKS_FILE, JSON.stringify(bloodbanks, null, 2));

    res.status(201).json(newBloodbank);
  } catch (err) {
    next(err);
  }
});

// -----------------------
// DELETE BLOODBANK
// -----------------------
router.delete("/manage-bloodbanks/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!fs.existsSync(BLOODBANKS_FILE)) {
      return res.status(404).json({ message: "Bloodbank not found" });
    }

    let bloodbanks = JSON.parse(fs.readFileSync(BLOODBANKS_FILE, "utf-8"));
    const index = bloodbanks.findIndex(b => b.id === req.params.id);

    if (index === -1) return res.status(404).json({ message: "Bloodbank not found" });

    const deleted = bloodbanks.splice(index, 1)[0];
    fs.writeFileSync(BLOODBANKS_FILE, JSON.stringify(bloodbanks, null, 2));

    res.json({ message: "Bloodbank deleted", deleted });
  } catch (err) {
    next(err);
  }
});

// -----------------------
// GET HOSPITALS
// -----------------------
router.get("/manage-hospitals", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!fs.existsSync(HOSPITALS_FILE)) {
      return res.status(200).json([]); // empty array if file doesn't exist
    }

    const data = JSON.parse(fs.readFileSync(HOSPITALS_FILE, "utf-8"));
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// -----------------------
// ADD HOSPITAL
// -----------------------
router.post("/manage-hospitals", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const { name, address, phone } = req.body;
    if (!name || !address || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hospitals = fs.existsSync(HOSPITALS_FILE)
      ? JSON.parse(fs.readFileSync(HOSPITALS_FILE, "utf-8"))
      : [];

    const newHospital = { id: Date.now().toString(), name, address, phone };
    hospitals.push(newHospital);

    fs.writeFileSync(HOSPITALS_FILE, JSON.stringify(hospitals, null, 2));

    res.status(201).json(newHospital);
  } catch (err) {
    next(err);
  }
});

// -----------------------
// DELETE HOSPITAL
// -----------------------
router.delete("/manage-hospitals/:id", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    if (!fs.existsSync(HOSPITALS_FILE)) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    let hospitals = JSON.parse(fs.readFileSync(HOSPITALS_FILE, "utf-8"));
    const index = hospitals.findIndex(h => h.id === req.params.id);

    if (index === -1) return res.status(404).json({ message: "Hospital not found" });

    const deleted = hospitals.splice(index, 1)[0];
    fs.writeFileSync(HOSPITALS_FILE, JSON.stringify(hospitals, null, 2));

    res.json({ message: "Hospital deleted", deleted });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
