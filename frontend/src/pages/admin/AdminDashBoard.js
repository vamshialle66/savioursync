import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaHospital, FaTint, FaUsers, FaClipboardList, FaChevronRight, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    users: 0,
    donors: 0,
    bloodbanks: 0,
    hospitals: 0,
    pendingApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch users count
        const usersRes = await fetch("http://localhost:5000/api/admin/manage-users?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await usersRes.json();
        const usersCount = usersData.total || 0;

        // Fetch donors count
        const donorsRes = await fetch("http://localhost:5000/api/donors?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const donorsData = await donorsRes.json();
        const donorsCount = Array.isArray(donorsData) ? donorsData.length : donorsData.total || 0;

        // Fetch blood banks count
        const banksRes = await fetch("http://localhost:5000/api/admin/manage-bloodbanks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const banksData = await banksRes.json();
        const banksCount = Array.isArray(banksData) ? banksData.length : banksData.length || 0;

        // Fetch hospitals count
        const hospitalsRes = await fetch("http://localhost:5000/api/admin/manage-hospitals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hospitalsData = await hospitalsRes.json();
        const hospitalsCount = Array.isArray(hospitalsData) ? hospitalsData.length : hospitalsData.length || 0;

        // Fetch pending applications count
        const applicationsRes = await fetch("http://localhost:5000/api/admin/applications?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const applicationsData = await applicationsRes.json();
        const applicationsCount = applicationsData.total || 0;

        setCounts({
          users: usersCount,
          donors: donorsCount,
          bloodbanks: banksCount,
          hospitals: hospitalsCount,
          pendingApplications: applicationsCount,
        });
      } catch (err) {
        console.error("Error fetching counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      title: "Manage Users",
      description: "View and manage all user accounts",
      icon: <FaUsers />,
      route: "/admin/manage-users",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-500",
      count: counts.users,
    },
    {
      title: "Manage Donors",
      description: "Handle donor profiles and information",
      icon: <FaUser />,
      route: "/admin/manage-donors",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      iconColor: "text-red-500",
      count: counts.donors,
    },
    {
      title: "Blood Banks",
      description: "Manage blood bank inventory",
      icon: <FaTint />,
      route: "/admin/manage-bloodbanks",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      count: counts.bloodbanks,
    },
    {
      title: "Hospitals",
      description: "Manage hospital information",
      icon: <FaHospital />,
      route: "/admin/manage-hospitals",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
      count: counts.hospitals,
    },
    {
      title: "Verification Queue",
      description: "Review pending donor applications",
      icon: <FaClipboardList />,
      route: "/admin/donor-verification",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
      count: counts.pendingApplications,
      urgent: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 md:px-8 pt-24 md:pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <FaShieldAlt className="text-red-500 w-8 h-8" />
            <span className="text-sm font-semibold text-red-600 uppercase tracking-wider">Administrator</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">Control Panel</h1>
          <p className="text-gray-600 text-lg">Manage all platform resources and user activities</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: "Total Users", value: "2,156" },
            { label: "Active Donors", value: "1,234" },
            { label: "Blood Banks", value: "42" },
            { label: "Hospitals", value: "28" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition"
              variants={itemVariants}
            >
              <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Cards Grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cards.map((card, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onClick={() => navigate(card.route)}
              className="group cursor-pointer"
            >
              <div className="h-full bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Top Gradient Bar */}
                <div className={`h-1 bg-gradient-to-r ${card.color}`} />

                <div className="p-8">
                  {/* Header with Icon and Count */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-xl ${card.bgColor} group-hover:scale-110 transition-transform`}>
                      <div className={`${card.iconColor} text-2xl`}>{card.icon}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${card.urgent ? "text-red-600" : "text-gray-900"}`}>
                        {card.count}
                      </div>
                      {card.urgent && (
                        <motion.span
                          className="text-xs font-semibold text-red-600 animate-pulse"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          URGENT
                        </motion.span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">{card.description}</p>

                  {/* Bottom Action */}
                  <div className="flex items-center text-red-500 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                    Access
                    <FaChevronRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          className="mt-16 bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-blue-900 font-medium">
            Manage your platform with confidence. All changes are logged and monitored for security.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;