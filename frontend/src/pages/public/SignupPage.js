import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Collect validation errors from backend
        if (data.errors && Array.isArray(data.errors)) {
          setErrors(data.errors.map((err) => err.msg));
        } else if (data.message) {
          setErrors([data.message]);
        } else {
          setErrors(["Signup failed"]);
        }
        return;
      }

      // Auto-login after successful signup
      const loginRes = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setErrors([loginData.message || "Login failed after signup"]);
        return;
      }

      localStorage.setItem("token", loginData.token);
      localStorage.setItem("username", loginData.username || formData.username);
      localStorage.setItem("role", loginData.role);

      navigate("/user/profile/me");
    } catch (err) {
      setErrors([err.message]);
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
        Create Account
      </motion.h2>

      <motion.form
        onSubmit={handleSignup}
        className="max-w-xl w-full bg-white p-8 rounded-3xl shadow-lg flex flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Display backend validation errors */}
        {errors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl flex flex-col gap-1">
            {errors.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </div>
        )}

        {/* Username */}
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-red-400 text-white py-3 rounded-xl font-bold hover:bg-red-500 transition"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-red-700 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </motion.div>
  );
};

export default SignupPage;
