import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBirthdayCake, FaWeight, FaPhone, FaNotesMedical } from "react-icons/fa";
import Select from "../../components/Select";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

const CustomLocationInput = ({ value, onSelect, placeholder }) => {
  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300, defaultValue: value || "" });

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onSelect({ address, lat, lng });
    } catch (error) {
      console.error("Error fetching location coordinates:", error);
    }
  };

  return (
    <div className="relative w-full">
      <input
        value={inputValue}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder={placeholder}
        className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
      />
      {status === "OK" && data.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow-lg rounded-xl mt-1 max-h-60 overflow-auto">
          {data.map(({ place_id, description }) => (
            <li key={place_id} onClick={() => handleSelect(description)} className="p-3 cursor-pointer hover:bg-red-100">
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: "",
    bloodGroup: "",
    phone: "",
    weight: "",
    medicalConditions: "",
    location: "",
    locationCoords: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alreadyDonor, setAlreadyDonor] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    // Check if user is already a donor
    const checkDonor = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/donors/check", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.exists) setAlreadyDonor(true);
      } catch (err) {
        console.error(err);
      }
    };

    checkDonor();
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLocationChange = ({ address, lat, lng }) => {
    setFormData({
      ...formData,
      location: address,
      locationCoords: [lng, lat],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/donors/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register donor");

      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (alreadyDonor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">You are already a donor</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-10 px-4">
      <motion.h1 className="text-3xl font-bold text-center mb-6 text-red-700" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        Register as a Donor
      </motion.h1>

      <motion.div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
        {error && <p className="text-center text-red-700 font-semibold mb-6">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Age */}
          <div className="relative">
            <FaBirthdayCake className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age (18-70)" min={18} max={70} required className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>

          {/* Phone */}
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>

          {/* Blood Group */}
          <Select label="Blood Group" options={bloodGroups} value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })} />

          {/* Weight */}
          <div className="relative">
            <FaWeight className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" min={30} max={200} required className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>

          {/* Medical Conditions */}
          <div className="relative">
            <FaNotesMedical className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} placeholder="Medical Conditions (if any)" className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>

          {/* Location */}
          <CustomLocationInput value={formData.location} onSelect={handleLocationChange} placeholder="Enter your city or location" />

          <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-red-700">
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
