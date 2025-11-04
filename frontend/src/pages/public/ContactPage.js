import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaCommentDots } from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send message");

      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen w-full bg-white flex flex-col items-center justify-start pt-32 px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title & Subtitle outside card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 max-w-2xl"
      >
        <h2 className="text-4xl font-bold text-red-700 mb-4">Get in Touch</h2>
        <p className="text-gray-600">
          Questions, feedback, or urgent messages? Reach out and we'll respond as soon as possible.
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-3xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Name Input */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>

          {/* Message Input */}
          <div className="relative">
            <FaCommentDots className="absolute left-3 top-3 text-gray-400" />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-4 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 h-48 resize-none"
              required
            />
          </div>

          {/* Success & Error Messages */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-700 font-semibold text-center"
            >
              ✅ Message sent successfully!
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-700 font-semibold text-center"
            >
              ❌ {error}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-red-700 transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;
