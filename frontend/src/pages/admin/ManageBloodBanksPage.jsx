
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaPlus, FaTint, FaMapMarkerAlt, FaPhone, FaSearch } from "react-icons/fa";

const ManageBloodbanksPage = () => {
  const [bloodbanks, setBloodbanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", location: "", contact: "" });

  const fetchBloodbanks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/manage-bloodbanks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch blood banks");
      const data = await res.json();
      setBloodbanks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBloodBank = async (e) => {
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

      const res = await fetch("http://localhost:5000/api/admin/manage-bloodbanks", {
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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Server error: ${res.status}`);
      }

      setFormData({ name: "", location: "", contact: "" });
      setError("");
      setShowForm(false);
      fetchBloodbanks();
    } catch (err) {
      console.error("Error adding blood bank:", err);
      setError(err.message || "Failed to add blood bank. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blood bank?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/admin/manage-bloodbanks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete blood bank");
      setSelectedBank(null);
      fetchBloodbanks();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchBloodbanks();
  }, []);

  const filteredBloodbanks = bloodbanks.filter((b) =>
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.contact?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <FaTint className="text-blue-500 w-8 h-8" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Management</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Blood Bank Management</h1>
              <p className="text-gray-600 mt-2">{bloodbanks.length} facilities registered</p>
            </div>
            <motion.button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg w-fit transition"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
            >
              <FaPlus className="w-4 h-4" /> Add Blood Bank
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
              ✕
            </button>
          </motion.div>
        )}

        {/* Add Blood Bank Form */}
        {showForm && (
          <motion.div
            className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 md:p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Blood Bank</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBloodBank} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Bank Name</label>
                <input
                  type="text"
                  placeholder="Indian Red Cross Society Blood Bank"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="text"
                  placeholder="+91-22-2309-6979"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location Address</label>
                <input
                  type="text"
                  placeholder="AWMH, 8th Floor, Mumbai Central (East), Mumbai"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                />
              </div>
              <motion.button
                type="submit"
                className="md:col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded flex items-center justify-center gap-2 shadow-md transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus className="w-4 h-4" /> Add Blood Bank
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
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
        </motion.div>

        {/* Main Content - List and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Blood Bank List */}
          <motion.div
            className="lg:col-span-1 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center justify-between">
                Blood Banks
                <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {filteredBloodbanks.length}
                </span>
              </h3>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : filteredBloodbanks.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">No blood banks found</div>
            ) : (
              <div className="overflow-y-auto max-h-96 md:max-h-full">
                {filteredBloodbanks.map((bank) => (
                  <motion.button
                    key={bank._id || bank.id}
                    onClick={() => setSelectedBank(bank)}
                    className={`w-full px-4 py-3 border-b border-gray-200 text-left transition ${
                      selectedBank?._id === bank._id || selectedBank?.id === bank.id
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <p className="font-semibold text-gray-900 text-sm truncate">{bank.name}</p>
                    <p className="text-xs text-gray-600 truncate mt-1">{bank.contact}</p>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Blood Bank Details */}
          {selectedBank ? (
            <motion.div
              className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedBank.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">Blood Bank Details & Inventory</p>
                </div>
                <motion.button
                  onClick={() => handleDelete(selectedBank._id || selectedBank.id)}
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
                      <FaPhone className="w-4 h-4 text-blue-500" />
                      <span>{selectedBank.contact}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-700">
                      <FaMapMarkerAlt className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{selectedBank.location}</span>
                    </div>
                  </div>
                </div>

                {/* Blood Inventory */}
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-600 font-semibold mb-3">Blood Inventory</p>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedBank.bloodInventory &&
                      Object.entries(selectedBank.bloodInventory).map(([type, count]) => (
                        <div key={type} className="bg-gray-100 rounded p-3 text-center border border-gray-200">
                          <p className="text-xs font-bold text-gray-700">{type}</p>
                          <p className={`text-lg font-bold mt-1 ${count === 0 ? "text-gray-400" : "text-blue-600"}`}>
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
                <FaTint className="w-16 h-16 text-gray-300 mx-auto mb-4 opacity-50" />
                <p className="text-gray-500 text-lg">Select a blood bank to view details</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBloodbanksPage;