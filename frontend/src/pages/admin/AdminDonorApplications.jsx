import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaUser, FaEnvelope, FaMapMarkerAlt, FaCalendar, FaChevronLeft, FaChevronRight, FaClock, FaExclamationTriangle } from "react-icons/fa";

const BACKEND_URL = "http://localhost:5000";

const AdminDonorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedApp, setExpandedApp] = useState(null);
  const limit = 10;
  const token = localStorage.getItem("token");

  // Fetch pending applications
  const fetchApplications = async (pageNumber = 1) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/admin/applications?page=${pageNumber}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON response: ${text}`);
      }
      if (!res.ok) throw new Error(data?.message || `Server error: ${res.status}`);
      setApplications(data.applications || []);
      setTotalPages(Math.ceil((data.total || 0) / limit));
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to fetch applications.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(page);
  }, [page]);

  // Approve or reject application
  const handleDecision = async (id, status) => {
    const adminNotes = prompt("Enter admin notes (optional):") || "";
    let bloodGroup = "";
    let phone = "";
    let weight = "";

    if (status === "Approved") {
      bloodGroup = prompt("Blood group (e.g., O+, B-):") || "";
      phone = prompt("Phone number:") || "";
      weight = prompt("Weight (kg):") || "";

      if (!bloodGroup || !phone || !weight) {
        alert("All fields are required for approval");
        return;
      }
    }

    const coordinates = [0, 0]; // placeholder

    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/verify-donor/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, adminNotes, bloodGroup, phone, weight, coordinates }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON response: ${text}`);
      }
      if (!res.ok) throw new Error(data?.message || `Server error: ${res.status}`);
      setMessage(`Application ${status} successfully`);
      setMessageType("success");
      setExpandedApp(null);
      fetchApplications(page);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to update application.");
      setMessageType("error");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 md:px-8 pt-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <FaClock className="text-purple-500 w-8 h-8" />
            <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Verification</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Pending Applications</h1>
          <p className="text-gray-600 mt-2">Review and verify donor applications</p>
        </motion.div>

        {/* Message Alert */}
        {message && (
          <motion.div
            className={`mb-6 p-4 rounded-xl font-semibold text-center border ${
              messageType === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {message}
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide">Total Pending</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{applications.length}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide">Page</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {page} / {totalPages || 1}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm col-span-2 md:col-span-1">
            <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide">Per Page</p>
            <p className="text-3xl font-bold text-gray-600 mt-2">{limit}</p>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            className="flex justify-center items-center h-64"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-gray-500 font-medium">Loading applications...</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && applications.length === 0 && (
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-2xl p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FaCheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-4 opacity-50" />
            <p className="text-blue-900 font-semibold text-lg">No pending applications</p>
            <p className="text-blue-700 mt-2">All applications have been reviewed!</p>
          </motion.div>
        )}

        {/* Applications List */}
        {!loading && applications.length > 0 && (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {applications.map((app) => (
              <motion.div
                key={app._id}
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Expandable Header */}
                <button
                  onClick={() => setExpandedApp(expandedApp === app._id ? null : app._id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-lg">
                          {app.userId?.username?.charAt(0).toUpperCase() || "?"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{app.userId?.username || "Unknown"}</h3>
                        <p className="text-sm text-gray-600">{app.userId?.email || "No email"}</p>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      {app.dob && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaCalendar className="text-gray-400 w-4 h-4" />
                          <span>{new Date(app.dob).toLocaleDateString()}</span>
                        </div>
                      )}
                      {app.address && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaMapMarkerAlt className="text-gray-400 w-4 h-4" />
                          <span className="truncate">{app.address}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          app.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 text-gray-400">
                    <motion.div animate={{ rotate: expandedApp === app._id ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <FaChevronRight className="w-5 h-5" />
                    </motion.div>
                  </div>
                </button>

                {/* Expanded Content */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: expandedApp === app._id ? "auto" : 0,
                    opacity: expandedApp === app._id ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-2">Email</p>
                        <p className="text-gray-900 flex items-center gap-2">
                          <FaEnvelope className="text-gray-400 w-4 h-4" /> {app.userId?.email || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-2">Date of Birth</p>
                        <p className="text-gray-900 flex items-center gap-2">
                          <FaCalendar className="text-gray-400 w-4 h-4" />{" "}
                          {app.dob ? new Date(app.dob).toLocaleDateString() : "-"}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide mb-2">Address</p>
                        <p className="text-gray-900 flex items-start gap-2">
                          <FaMapMarkerAlt className="text-gray-400 w-4 h-4 mt-1 flex-shrink-0" /> {app.address || "-"}
                        </p>
                      </div>
                      {app.adminNotes && (
                        <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-xs text-blue-600 uppercase font-semibold tracking-wide mb-2">Admin Notes</p>
                          <p className="text-blue-900">{app.adminNotes}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        onClick={() => handleDecision(app._id, "Approved")}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg transition"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaCheckCircle className="w-4 h-4" /> Approve
                      </motion.button>
                      <motion.button
                        onClick={() => handleDecision(app._id, "Rejected")}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg transition"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaTimesCircle className="w-4 h-4" /> Reject
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <motion.div
            className="flex items-center justify-center gap-4 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaChevronLeft className="w-5 h-5 text-gray-600" />
            </motion.button>

            <div className="flex items-center gap-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <motion.button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                    page === p
                      ? "bg-red-500 text-white shadow-lg"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {p}
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaChevronRight className="w-5 h-5 text-gray-600" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDonorApplications;