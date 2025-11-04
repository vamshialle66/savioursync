import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaPlus, FaHospital, FaMapMarkerAlt, FaPhone, FaSearch, FaEdit, FaTimes, FaChevronDown } from "react-icons/fa";

const ManageHospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", location: "", contact: "" });

  const fetchHospitals = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/manage-hospitals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch hospitals");
      const data = await res.json();
      setHospitals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHospital = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim() || !formData.contact.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }

      const res = await fetch("http://localhost:5000/api/admin/manage-hospitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          location: formData.location.trim(),
          contact: formData.contact.trim(),
          locationCoords: { type: "Point", coordinates: [0, 0] },
          bloodInventory: { "A+": 0, "A-": 0, "B+": 0, "B-": 0, "AB+": 0, "AB-": 0, "O+": 0, "O-": 0 },
          organInventory: { "Kidney": 0, "Liver": 0, "Heart": 0, "Lungs": 0, "Pancreas": 0, "Eyes": 0 },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Server error: ${res.status}`);
      }

      setFormData({ name: "", location: "", contact: "" });
      setError("");
      setShowForm(false);
      fetchHospitals();
    } catch (err) {
      console.error("Error adding hospital:", err);
      setError(err.message || "Failed to add hospital. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hospital?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/manage-hospitals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete hospital");
      setSelectedHospital(null);
      fetchHospitals();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter((h) =>
    h.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.contact?.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 md:px-8 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <FaHospital className="text-green-500 w-8 h-8" />
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Administration</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Hospital Management</h1>
              <p className="text-gray-600 mt-2">{hospitals.length} facilities registered</p>
            </div>
            <motion.button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg w-fit transition"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
            >
              <FaPlus className="w-4 h-4" /> Add Hospital
            </motion.button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-600 font-medium">{error}</p>
            <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">
              <FaTimes />
            </button>
          </motion.div>
        )}

        {/* Add Hospital Form */}
        {showForm && (
          <motion.div
            className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 md:p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Hospital</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddHospital} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hospital Name</label>
                <input
                  type="text"
                  placeholder="Care Hospitals Banjara Hills"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="text"
                  placeholder="+91-40-6666-6666"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location Address</label>
                <input
                  type="text"
                  placeholder="Road No 1, Banjara Hills, Hyderabad, Telangana 500034"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
                />
              </div>
              <motion.button
                type="submit"
                className="md:col-span-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded flex items-center justify-center gap-2 shadow-md transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus className="w-4 h-4" /> Add Hospital
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Search Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, location, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
            />
          </div>
        </motion.div>

        {/* Main Content - List and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hospital List */}
          <motion.div
            className="lg:col-span-1 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center justify-between">
                Hospitals
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                  {filteredHospitals.length}
                </span>
              </h3>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : filteredHospitals.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No hospitals found</div>
            ) : (
              <div className="overflow-y-auto max-h-96 md:max-h-full">
                {filteredHospitals.map((hospital) => {
                  return (
                    <motion.button
                      key={hospital._id || hospital.id}
                      onClick={() => setSelectedHospital(hospital)}
                      className={`w-full px-4 py-3 border-b border-gray-200 text-left transition ${
                        selectedHospital?._id === hospital._id || selectedHospital?.id === hospital.id
                          ? "bg-green-50 border-l-4 border-l-green-500"
                          : "hover:bg-gray-50"
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <p className="font-semibold text-gray-900 text-sm truncate">{hospital.name}</p>
                      <p className="text-xs text-gray-600 truncate mt-1">{hospital.contact}</p>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Hospital Details */}
          {selectedHospital ? (
            <motion.div
              className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedHospital.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">Hospital Details & Inventory</p>
                </div>
                <motion.button
                  onClick={() => handleDelete(selectedHospital._id || selectedHospital.id)}
                  className="p-2 rounded bg-red-50 text-red-500 hover:bg-red-100 transition"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Delete"
                >
                  <FaTrash className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-600 font-semibold mb-2">Contact Information</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaPhone className="w-4 h-4 text-green-500" />
                      <span>{selectedHospital.contact}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-700">
                      <FaMapMarkerAlt className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{selectedHospital.location}</span>
                    </div>
                  </div>
                </div>

                {/* Blood Inventory */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-600 font-semibold mb-3">Blood Inventory</p>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedHospital.bloodInventory &&
                      Object.entries(selectedHospital.bloodInventory).map(([type, count]) => (
                        <div key={type} className="bg-gray-100 rounded p-3 text-center border border-gray-200">
                          <p className="text-xs font-bold text-gray-700">{type}</p>
                          <p className={`text-lg font-bold mt-1 ${count === 0 ? "text-gray-400" : count < 5 ? "text-red-500" : "text-green-500"}`}>
                            {count}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Organ Inventory */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-600 font-semibold mb-3">Organ Inventory</p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedHospital.organInventory &&
                      Object.entries(selectedHospital.organInventory).map(([organ, count]) => (
                        <div key={organ} className="bg-gray-100 rounded p-3 text-center border border-gray-200">
                          <p className="text-xs font-bold text-gray-700">{organ}</p>
                          <p className={`text-lg font-bold mt-1 ${count === 0 ? "text-gray-400" : count < 2 ? "text-red-500" : "text-green-500"}`}>
                            {count}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-lg p-12 flex items-center justify-center text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div>
                <FaHospital className="w-16 h-16 text-gray-300 mx-auto mb-4 opacity-50" />
                <p className="text-gray-500 text-lg">Select a hospital to view details</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageHospitalsPage;