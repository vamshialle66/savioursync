import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      navigate("/user/profile/me");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-3xl font-bold text-red-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Login
      </motion.h2>

      <motion.form
        onSubmit={handleLogin}
        className="max-w-xl w-full bg-white p-8 rounded-3xl shadow-lg flex flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {error && <p className="text-red-400 text-center">{error}</p>}

        {/* Email Input */}
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 transition"
          />
        </div>

        {/* Password Input */}
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 transition"
          />
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-red-700 font-semibold hover:underline text-sm"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="bg-red-400 text-white py-3 rounded-xl font-bold hover:bg-red-500 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>

        <p className="text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-red-700 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.form>
    </motion.div>
  );
};

export default LoginPage;
