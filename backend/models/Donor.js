// models/Donor.js
const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    age: { type: Number, required: true, min: 18, max: 70 },
    bloodGroup: { type: String, required: true, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    lastDonation: { type: Date },
    donationHistory: [
      {
        type: { type: String, enum: ["Blood", "Platelets", "Plasma"], default: "Blood" },
        date: Date,
        location: String,
        volume: Number,
      },
    ],
    location: { type: String, required: true },
    locationCoords: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] },
    },
    phone: { type: String },
    weight: { type: Number },
    medicalHistory: [
      {
        condition: { type: String, required: true },
        diagnosisDate: { type: Date },
        status: { type: String, enum: ["Ongoing", "Resolved"], default: "Ongoing" },
        notes: { type: String },
      },
    ],
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "DonorApplication" },

    // ✅ New field: date when donor was verified
    verifiedAt: { type: Date }, 
  },
  { timestamps: true, collection: "donors" }
);

donorSchema.index({ locationCoords: "2dsphere" });

module.exports = mongoose.model("Donor", donorSchema);
