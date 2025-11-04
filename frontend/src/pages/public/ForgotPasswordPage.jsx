import React, { useState } from "react";
import { motion } from "framer-motion";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset link");

      setMessage(data.message);
      setEmail("");
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
        Forgot Password
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="max-w-xl w-full bg-white p-8 rounded-3xl shadow-lg flex flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {error && <p className="text-red-400 text-center">{error}</p>}
        {message && <p className="text-green-400 text-center">{message}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-red-400 text-white py-3 rounded-xl font-bold hover:bg-red-500 transition"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </motion.form>
    </motion.div>
  );
};

export default ForgotPasswordPage;