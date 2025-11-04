import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaBirthdayCake,
  FaHeartbeat,
  FaMapMarkerAlt,
  FaPhone,
  FaWeight,
  FaEnvelope,
  FaCalendar,
  FaCheckCircle,
  FaEdit,
  FaClipboardList,
  FaHistory,
} from "react-icons/fa";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [donorData, setDonorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        // Single endpoint that returns everything
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await res.json();
        setUserData(data.user);
        setDonorData(data.donor);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-500 font-medium"
        >
          Loading profile...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
        <motion.div
          className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition font-medium"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <p className="text-gray-600">User data not found</p>
      </div>
    );
  }

  const isVerified = donorData?.stats?.isVerified;
  const totalDonations = donorData?.stats?.totalDonations || 0;
  const totalVolume = donorData?.stats?.totalVolume || 0;
  const lastDonation = donorData?.stats?.lastDonation || "N/A";

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            <motion.div
              className="w-32 h-32 rounded-2xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center text-red-600 font-bold text-6xl shadow-lg flex-shrink-0 relative ring-4 ring-red-50"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              {userData?.username?.charAt(0).toUpperCase() || "U"}
              {isVerified && (
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg ring-4 ring-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <FaCheckCircle className="text-white w-5 h-5" />
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{userData?.username}</h1>
                {isVerified && (
                  <motion.div
                    className="bg-green-50 px-3 py-1 rounded-full border border-green-200"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-xs font-semibold text-green-700">✓ Verified</span>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-gray-700 text-sm flex items-center gap-2">
                  <FaEnvelope className="w-4 h-4 text-red-500" /> {userData?.email}
                </p>
                <p className="text-gray-700 text-sm flex items-center gap-2">
                  <FaPhone className="w-4 h-4 text-red-500" /> {userData?.phone || "Not provided"}
                </p>
                <p className="text-gray-700 text-sm capitalize">
                  <span className="font-semibold text-gray-900">Role:</span> {userData?.role}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <motion.button
                  onClick={() => navigate("/update-profile")}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition flex items-center gap-2"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEdit className="w-4 h-4" /> Edit Profile
                </motion.button>
                {donorData && !isVerified && (
                  <motion.button
                    onClick={() => navigate("/verify-donor")}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition flex items-center gap-2"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaCheckCircle className="w-4 h-4" /> Get Verified
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Donor Section */}
        {donorData ? (
          <>
            {/* Donation Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StatCard
                label="Total Donations"
                value={totalDonations}
                icon={<FaHeartbeat />}
                color="red"
              />
              <StatCard
                label="Total Volume"
                value={`${totalVolume} ml`}
                icon={<FaClipboardList />}
                color="blue"
              />
              <StatCard
                label="Last Donation"
                value={lastDonation}
                icon={<FaCalendar />}
                color="purple"
              />
            </motion.div>

            {/* Donor Info Card */}
            <motion.div
              className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Donor Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoRow
                  icon={<FaBirthdayCake />}
                  label="Age"
                  value={`${donorData.age || "N/A"} years`}
                />
                <InfoRow
                  icon={<FaHeartbeat />}
                  label="Blood Type"
                  value={donorData.bloodGroup || "N/A"}
                />
                <InfoRow
                  icon={<FaMapMarkerAlt />}
                  label="Location"
                  value={donorData.location || "N/A"}
                />
                <InfoRow
                  icon={<FaPhone />}
                  label="Phone"
                  value={donorData.phone || userData?.phone || "N/A"}
                />
                <InfoRow
                  icon={<FaWeight />}
                  label="Weight"
                  value={`${donorData.weight || "N/A"} kg`}
                />
                <InfoRow
                  icon={<FaCalendar />}
                  label="Member Since"
                  value={new Date(donorData.createdAt).toLocaleDateString()}
                />
              </div>
            </motion.div>

            {/* Medical & Donation History */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Medical History */}
              <motion.div
                className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaClipboardList className="text-blue-500" /> Medical History
                </h3>
                {donorData.medicalHistory?.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {donorData.medicalHistory.map((med, idx) => (
                      <motion.div
                        key={idx}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-semibold text-gray-900">{med.condition}</p>
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                              med.status === "Ongoing"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {med.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{med.notes}</p>
                        <p className="text-xs text-gray-500">
                          Diagnosed: {new Date(med.diagnosisDate).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                    <p className="text-gray-500">No medical conditions reported</p>
                  </div>
                )}
              </motion.div>

              {/* Donation History */}
              <motion.div
                className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaHistory className="text-red-500" /> Donation History
                </h3>
                {donorData.donationHistory?.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {donorData.donationHistory.map((donation, idx) => (
                      <motion.div
                        key={idx}
                        className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 + idx * 0.05 }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-semibold text-gray-900">{donation.type}</p>
                          <p className="text-sm font-bold text-red-600">{donation.volume} ml</p>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{donation.location}</p>
                        <p className="text-xs text-gray-500">
                          Date: {new Date(donation.date).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                    <p className="text-gray-500">No donations on record</p>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        ) : (
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-3xl p-12 text-center shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <p className="text-blue-900 font-semibold text-lg mb-4">Not registered as a donor yet</p>
            <p className="text-blue-800 mb-6">Start your donor journey and help save lives</p>
            <motion.button
              onClick={() => navigate("/apply-donor")}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-lg shadow transition"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply as Donor
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    red: "bg-red-50 border-red-200 text-red-600",
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
  };

  return (
    <motion.div
      className={`rounded-2xl p-6 shadow-lg border ${colors[color]} text-center`}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-center mb-3 text-3xl">{icon}</div>
      <p className="text-gray-700 text-sm font-semibold mb-2">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </motion.div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <motion.div
    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition"
    whileHover={{ x: 4 }}
  >
    <div className="text-red-500 w-6 h-6 mt-1 flex-shrink-0 text-xl">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-gray-900 font-semibold text-lg mt-1">{value}</p>
    </div>
  </motion.div>
);

export default ProfilePage;