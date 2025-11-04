import React from "react";

const DonorDetailsModal = ({ donor, onClose }) => {
  if (!donor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Donor Details</h2>
        <div className="flex flex-col gap-2">
          <p><strong>ID:</strong> {donor._id}</p>
          <p><strong>Name:</strong> {donor.name}</p>
          <p><strong>Email:</strong> {donor.email}</p>
          <p><strong>Phone:</strong> {donor.phone}</p>
          <p><strong>Location:</strong> {donor.location}</p>
          <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
          <p><strong>Organ:</strong> {donor.organ}</p>
          <p><strong>Status:</strong> {donor.status}</p>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonorDetailsModal;
