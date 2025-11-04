import React, { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaUser, FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import MapPickerModal from "../../components/MapPickerModal";

const ApplyDonor = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: null,
    address: "",
    coords: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMapPicker, setShowMapPicker] = useState(false);

  const token = localStorage.getItem("token");
  const isDisabled = !token;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, dob: date });
  };

  const handleMapSelect = async (lat, lng) => {
    setFormData({ ...formData, coords: [lng, lat] });

    // Reverse geocode to fill address
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.status === "OK") {
        const formattedAddress = data.results[0]?.formatted_address || "";
        setFormData((prev) => ({ ...prev, address: formattedAddress }));
      }
    } catch (err) {
      console.error("Reverse geocode error:", err);
    }

    setShowMapPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!token) {
      setMessage("You must be logged in to apply as a donor.");
      setLoading(false);
      return;
    }

    try {
        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dob: formData.dob?.toISOString().split("T")[0] || "",
            address: formData.address,
            coords: formData.coords,
};


      const res = await fetch("http://localhost:5000/api/donors/apply-donor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Application submitted successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          dob: null,
          address: "",
          coords: null,
        });
      } else {
        setMessage(data.message || "Failed to submit application.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <motion.div
        className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl font-bold text-red-700 text-center mb-6">
          Apply as a Donor
        </h1>

        {!token && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center font-semibold">
            You need to login first to apply as a donor
          </p>
        )}

        {message && (
          <p
            className={`text-center mb-4 font-semibold ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First + Last Name */}
          <div className="flex gap-3">
            <div className="relative w-1/2">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
                disabled={isDisabled}
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
              />
            </div>
            <div className="relative w-1/2">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
                disabled={isDisabled}
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="relative">
            <FaBirthdayCake className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <DatePicker
              selected={formData.dob}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Date of Birth"
              className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
              disabled={isDisabled}
            />
          </div>

          {/* Address */}
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              rows={3}
              required
              disabled={isDisabled}
              className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 resize-none"
            />
            <button
              type="button"
              onClick={() => setShowMapPicker(true)}
              disabled={isDisabled}
              className="absolute bottom-2 right-2 text-red-600 font-semibold hover:text-red-700"
            >
              Pick location on map
            </button>
          </div>

          {showMapPicker && (
            <MapPickerModal
              onSelect={handleMapSelect}
              onClose={() => setShowMapPicker(false)}
            />
          )}

          <button
            type="submit"
            disabled={loading || isDisabled}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ApplyDonor;
