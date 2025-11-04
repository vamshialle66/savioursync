const express = require("express");
const router = express.Router();

const Donor = require("../models/Donor");
const DonorApplication = require("../models/DonorApplication");
const verifyToken = require("../middleware/verifyToken");

// -------------------
// HELPER: Haversine distance (optional)
// -------------------
function haversineMeters(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// -------------------
// REGISTER OR UPDATE DONOR PROFILE
// -------------------
router.post("/register", verifyToken, async (req, res) => {
  try {
    const { bloodGroup, location, locationCoords, age, weight, phone, medicalConditions } = req.body;

    if (!locationCoords || !Array.isArray(locationCoords) || locationCoords.length !== 2) {
      return res.status(400).json({ message: "Valid location coordinates required" });
    }
    if (!location || !bloodGroup || !age || !weight || !phone) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }
    if (age < 18 || age > 70) return res.status(400).json({ message: "Age must be 18-70" });

    const existingDonor = await Donor.findOne({ userId: req.user.id });
    if (existingDonor) {
      return res.status(400).json({ message: "Donor profile already exists" });
    }

    const donor = new Donor({
      userId: req.user.id,
      bloodGroup,
      organs: null,
      location,
      locationCoords: { type: "Point", coordinates: locationCoords },
      age,
      weight,
      phone,
      medicalConditions: medicalConditions || "",
      createdBy: req.user.id,
    });

    await donor.save();
    res.status(201).json({ message: "Donor profile created successfully", donor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------
// CHECK IF USER HAS DONOR PROFILE
// -------------------
router.get("/check", verifyToken, async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user.id });
    res.json({ exists: !!donor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/public/:userId", async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.params.userId })
      .populate("userId", "username email");

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    // Build safe, readable response object
    const safeDonor = {
      id: donor._id,
      name: donor.userId?.username || "Unnamed",
      email: donor.userId?.email || null,
      bloodGroup: donor.bloodGroup || "Unknown",
      age: donor.age || null,
      weight: donor.weight || null,
      location: donor.location || "Unknown",
      locationCoords: donor.locationCoords || { coordinates: [0, 0] },
      lastDonation: donor.lastDonation || null,
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
      verifiedOn: donor.verifiedOn || null,
      createdAt: donor.createdAt,
      updatedAt: donor.updatedAt,
    };

    return res.status(200).json({ donor: safeDonor });
  } catch (err) {
    console.error("❌ Error fetching public donor data:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// -------------------
// SEARCH DONORS
// -------------------
router.get("/", async (req, res) => {
  try {
    let { type, value, page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};
    if (type === "blood" && value) query.bloodGroup = value;
    if (type === "organ" && value) query.organs = value;
    if (search) {
      query.$or = [
        { bloodGroup: new RegExp(search, "i") },
        { organs: new RegExp(search, "i") },
      ];
    }

    const total = await Donor.countDocuments(query);
    const donors = await Donor.find(query)
      .populate("userId", "username email")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const safeDonors = donors.map((d) => ({
      _id: d._id,
      type: "donor",
      bloodGroup: d.bloodGroup,
      organs: d.organs,
      age: d.age,
      weight: d.weight,
      medicalConditions: d.medicalConditions,
      name: d.userId?.username || "Unnamed",
      email: d.userId?.email || null,
      location: d.location || "Unknown",
      locationCoords: d.locationCoords || { coordinates: [0, 0] },
      lastDonation: d.lastDonation || null,
    }));

    res.json({ donors: safeDonors, total, page });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------
// APPLY AS DONOR (USER APPLICATION)
// -------------------
router.post("/apply-donor", verifyToken, async (req, res) => {
  try {
    const { firstName, lastName, dob, address, coords } = req.body;
    const userId = req.user.id || req.user._id;

    if (!firstName || !lastName || !dob || !address) {
      return res.status(400).json({ message: "First name, last name, DOB, and address required." });
    }

    const existing = await DonorApplication.findOne({ userId });
    if (existing) return res.status(400).json({ message: "You’ve already applied." });

    const application = await DonorApplication.create({
      userId,
      firstName,
      lastName,
      dob,
      address,
      locationCoords: coords ? { type: "Point", coordinates: coords } : undefined,
    });

    res.status(201).json({ message: "Application submitted successfully.", application });
  } catch (err) {
    console.error("❌ Error in apply-donor:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

module.exports = router;
