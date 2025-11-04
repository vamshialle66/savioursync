// src/components/Pagination.jsx
import React from "react";

const Pagination = ({ totalItems, pageSize, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages === 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4 gap-2">
      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded-md font-medium ${
            page === currentPage ? "bg-red-700 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
