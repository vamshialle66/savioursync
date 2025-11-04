import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin,
  Droplet,
  Calendar,
  User,
  Mail,
  Weight,
  Activity,
  Heart,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  Info,
} from "lucide-react";

export default function DonorProfile() {
  const { userId } = useParams();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/donors/public/${userId}`);
        const text = await res.text();
        const data = JSON.parse(text);
        if (!res.ok) throw new Error(data.message || "Failed to fetch donor data");
        setDonor(data.donor);
      } catch (err) {
        console.error("Error fetching donor:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonor();
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-500 font-medium"
        >
          Loading profile...
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md">
          <p className="text-red-600 font-medium text-center">{error}</p>
        </div>
      </div>
    );

  if (!donor)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm max-w-md">
          <p className="text-gray-600 text-center">Donor not found.</p>
        </div>
      </div>
    );

  const isVerified = !!donor.verifiedAt;
  const daysSinceLastDonation = donor.lastDonation
    ? Math.floor((Date.now() - new Date(donor.lastDonation)) / (1000 * 60 * 60 * 24))
    : null;
  const daysUntilNextDonation = donor.lastDonation
    ? Math.max(0, 56 - daysSinceLastDonation)
    : 0;
  const canDonateNow = daysUntilNextDonation === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="bg-white rounded-2xl p-8 md:p-12 mb-8 border border-gray-200 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar */}
            <motion.div
              className="w-24 h-24 rounded-xl bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center shadow-lg flex-shrink-0 relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <User className="text-red-500 w-12 h-12" strokeWidth={1.5} />
              {isVerified && (
                <motion.div
                  className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <CheckCircle2 className="text-white w-4 h-4" />
                </motion.div>
              )}
            </motion.div>

            {/* Name & Contact */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{donor.name}</h1>
                {isVerified && (
                  <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                    <Shield className="text-green-600 w-4 h-4" />
                    <span className="text-xs font-medium text-green-700">Verified</span>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoRow icon={<Mail />} label="Email" value={donor.email} />
                <InfoRow icon={<Phone />} label="Phone" value={donor.phone || "Not provided"} />
                <InfoRow icon={<MapPin />} label="Location" value={donor.location} />
                <InfoRow icon={<Calendar />} label="Member Since" value={new Date(donor.createdAt).toLocaleDateString()} />
              </div>
            </motion.div>

            {/* Status Badge */}
            <motion.div
              className={`rounded-xl p-6 text-center min-w-max border-2 flex flex-col gap-2 ${
                canDonateNow
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</p>
              {canDonateNow ? (
                <>
                  <p className="text-3xl font-bold text-green-600">✓ Ready</p>
                  <p className="text-xs text-green-700 font-medium">Can donate now</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-red-600">{daysUntilNextDonation}d</p>
                  <p className="text-xs text-red-700 font-medium">Wait to donate</p>
                </>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <StatBox icon={<Droplet />} label="Blood Type" value={donor.bloodGroup} color="red" />
          <StatBox icon={<Activity />} label="Age" value={`${donor.age}y`} color="green" />
          <StatBox icon={<Weight />} label="Weight" value={`${donor.weight}kg`} color="blue" />
          <StatBox icon={<Heart />} label="Last Donation" value={daysSinceLastDonation ? `${daysSinceLastDonation}d ago` : "Never"} color="purple" />
          <StatBox icon={<Calendar />} label="Days Left" value={daysSinceLastDonation ? `${daysUntilNextDonation}d` : "N/A"} color="orange" />
        </motion.div>

        {/* Donation Eligibility Explained */}
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Info className="text-blue-600 w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 mb-1">How Donation Works</p>
            <p className="text-sm text-blue-800">
              Donors can donate blood every 56 days (8 weeks) to allow their body to recover. The status above shows if this donor is ready or how long they need to wait.
            </p>
          </div>
        </motion.div>

        {/* History Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <HistorySection
            icon={<AlertCircle className="w-5 h-5" />}
            title="Medical Conditions"
            records={donor.medicalHistory}
            type="medical"
            delay={0.35}
            emptyMessage="No medical conditions reported"
          />
          <HistorySection
            icon={<Droplet className="w-5 h-5" />}
            title="Donation Record"
            records={donor.donationHistory}
            type="donation"
            delay={0.4}
            emptyMessage="No donations on record"
          />
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="text-gray-500 w-4 h-4 mt-0.5 flex-shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>
      <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
    </div>
  </div>
);

const StatBox = ({ icon, label, value, color }) => {
  const colors = {
    red: "bg-red-50 text-red-600 border-red-200",
    green: "bg-green-50 text-green-600 border-green-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };
  
  return (
    <motion.div
      className={`rounded-xl p-4 border text-center ${colors[color]}`}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-xs font-medium opacity-75 mb-1">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </motion.div>
  );
};

const HistorySection = ({ icon, title, records, type, delay, emptyMessage }) => (
  <motion.div
    className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span className={type === "medical" ? "text-blue-500" : "text-red-500"}>{icon}</span>
      {title}
    </h3>

    {records?.length ? (
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {records.map((r, i) => (
          <motion.div
            key={i}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + i * 0.05 }}
          >
            {type === "medical" ? (
              <>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{r.condition}</p>
                    <p className="text-xs text-gray-600 mt-1">{r.notes}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded whitespace-nowrap ${
                    r.status === "Ongoing"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Diagnosed {new Date(r.diagnosisDate).toLocaleDateString()}</p>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{r.type} Donation</p>
                    <p className="text-xs text-gray-600 mt-1">{r.location}</p>
                  </div>
                  <p className="text-sm font-bold text-red-600">{r.volume}ml</p>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(r.date).toLocaleDateString()}
                </p>
              </>
            )}
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
        <p className="text-gray-500 text-sm">{emptyMessage}</p>
      </div>
    )}
  </motion.div>
);