const mongoose = require("mongoose");

const DonorApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },        // manual address
    locationCoords: {                                // picked from map
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    adminNotes: { type: String, default: "" },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

DonorApplicationSchema.index({ locationCoords: "2dsphere" });

module.exports = mongoose.model("DonorApplication", DonorApplicationSchema);
