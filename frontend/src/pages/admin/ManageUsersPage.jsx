import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaUsers, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const ITEMS_PER_PAGE = 10;

  const fetchUsers = async (pageNumber = 1, searchQuery = "") => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/manage-users?page=${pageNumber}&limit=${ITEMS_PER_PAGE}&search=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(Math.ceil((data.total || 0) / ITEMS_PER_PAGE));
      setTotalUsers(data.total || 0);
      setPage(data.page || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/manage-users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete user");
      }
      fetchUsers(page, search);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search]);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "donor":
        return "bg-red-100 text-red-700";
      case "hospital":
        return "bg-green-100 text-green-700";
      case "bloodbank":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
            <FaUsers className="text-yellow-500 w-8 h-8" />
            <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wider">Administration</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Users</h1>
              <p className="text-gray-600 mt-2">Manage all system users and accounts</p>
            </div>
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
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide">Total Users</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide">Page</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {page} / {totalPages || 1}
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm col-span-2 md:col-span-1">
            <p className="text-xs text-gray-600 uppercase font-semibold tracking-wide">Per Page</p>
            <p className="text-3xl font-bold text-gray-600 mt-2">{ITEMS_PER_PAGE}</p>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            className="flex justify-center items-center h-64"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-gray-500 font-medium">Loading users...</p>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && !error && (
          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-2xl p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FaUsers className="w-12 h-12 text-blue-500 mx-auto mb-4 opacity-50" />
            <p className="text-blue-900 font-semibold text-lg">
              {search ? "No users found" : "No users available"}
            </p>
            <p className="text-blue-700 mt-2">
              {search ? "Try adjusting your search terms" : "Start adding users to the system"}
            </p>
          </motion.div>
        )}

        {/* Table */}
        {!loading && users.length > 0 && (
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Registered</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, idx) => (
                    <motion.tr
                      key={user._id}
                      className="hover:bg-gray-50 transition"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.username || "Unnamed"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-2">
                          <motion.button
                            onClick={() => alert("Edit user modal here")}
                            className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="Edit"
                          >
                            <FaEdit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            title="Delete"
                          >
                            <FaTrash className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 0 && (
          <motion.div
            className="flex items-center justify-center gap-3 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaChevronLeft className="w-5 h-5 text-gray-600" />
            </motion.button>

            <div className="flex items-center gap-1">
              {totalPages <= 5 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <motion.button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg font-semibold transition ${
                      page === p
                        ? "bg-yellow-500 text-white shadow-lg"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {p}
                  </motion.button>
                ))
              ) : (
                <>
                  <motion.button
                    onClick={() => setPage(1)}
                    className={`w-9 h-9 rounded-lg font-semibold transition ${
                      page === 1
                        ? "bg-yellow-500 text-white shadow-lg"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    1
                  </motion.button>
                  {page > 3 && <span className="px-2 text-gray-400">...</span>}
                  {Array.from({ length: 3 }, (_, i) => page - 1 + i)
                    .filter((p) => p > 1 && p < totalPages)
                    .map((p) => (
                      <motion.button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg font-semibold transition ${
                          page === p
                            ? "bg-yellow-500 text-white shadow-lg"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {p}
                      </motion.button>
                    ))}
                  {page < totalPages - 2 && <span className="px-2 text-gray-400">...</span>}
                  <motion.button
                    onClick={() => setPage(totalPages)}
                    className={`w-9 h-9 rounded-lg font-semibold transition ${
                      page === totalPages
                        ? "bg-yellow-500 text-white shadow-lg"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {totalPages}
                  </motion.button>
                </>
              )}
            </div>

            <motion.button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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

export default ManageUsersPage;