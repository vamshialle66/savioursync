import React, { useState, useEffect } from "react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const organs = ["Kidney", "Liver", "Heart", "Lungs", "Pancreas", "Eyes"];
const statuses = ["Active", "Inactive"];

const DonorFormModal = ({ donor, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    organ: "",
    status: "Active",
    location: "",
    locationCoords: null,
  });

  useEffect(() => {
    if (donor) setFormData({ ...formData, ...donor });
  }, [donor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Optionally, you can validate fields here
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{donor ? "Edit Donor" : "Add Donor"}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 border rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="p-2 border rounded-md"
            required
          />
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="p-2 border rounded-md"
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
          <select
            name="organ"
            value={formData.organ}
            onChange={handleChange}
            className="p-2 border rounded-md"
            required
          >
            <option value="">Select Organ</option>
            {organs.map(org => <option key={org} value={org}>{org}</option>)}
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="p-2 border rounded-md"
            required
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonorFormModal;
