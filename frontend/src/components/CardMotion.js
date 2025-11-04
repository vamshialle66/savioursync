// src/components/CardMotion.js
import { motion } from "framer-motion";
import { X } from "lucide-react";

// Motion wrapper for cards
export const ResultCard = ({ item, onClick, className = "" }) => {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`cursor-pointer rounded-2xl p-6 shadow-lg transition ${className}`}
    >
      {item.children || null}
    </motion.div>
  );
};

// Motion modal for details
export const DetailModal = ({ item, onClose, className = "" }) => {
  if (!item) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Blur backdrop */}
      <motion.div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal content */}
      <motion.div
        className={`relative z-10 max-w-2xl w-full mx-4 p-8 rounded-2xl shadow-2xl bg-white ${className}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X size={24} />
        </button>

        {item.children || null}
      </motion.div>
    </motion.div>
  );
};
