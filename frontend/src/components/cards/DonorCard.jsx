import React from "react";
import { FaHeartbeat, FaMapMarkerAlt, FaPhone, FaBell, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DonorCard = ({ item }) => {
  console.log("Donor item:", item);
  const navigate = useNavigate();

  const handleCall = () => {
    if (item.phone) window.open(`tel:${item.phone}`);
  };

  const handleVisitProfile = () => {
    navigate(`/profile/${item.userId._id}`);
  };

  const handleNotify = () => {
    alert(`Notified ${item.name || "Donor"}!`);
  };

  const googleMapsLink =
    item.locationCoords?.coordinates?.length === 2
      ? `https://www.google.com/maps/search/?api=1&query=${item.locationCoords.coordinates[1]},${item.locationCoords.coordinates[0]}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-5 border-l-8 border-red-500 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-red-100 text-red-500 p-3 rounded-full">
          <FaHeartbeat size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{item.name || "Unnamed"}</h3>
          {item.distance && (
            <span className="text-red-600 font-semibold text-sm">
              {(item.distance / 1000).toFixed(1)} km away
            </span>
          )}
        </div>
      </div>

      {/* Location */}
      {item.location && (
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-600 hover:text-red-500 text-sm font-medium"
        >
          <FaMapMarkerAlt /> {item.location}
        </a>
      )}

      {/* Vertical Details */}
      <div className="flex flex-col text-gray-700 text-sm font-medium gap-1">
        {item.age && <div>Age: {item.age}</div>}
        {item.weight && <div>Weight: {item.weight} kg</div>}
        {item.medicalConditions && <div>Conditions: {item.medicalConditions}</div>}
        {item.phone && <div>Phone: {item.phone}</div>}
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-3 mt-3">
        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition font-semibold"
        >
          <FaPhone /> Call
        </button>
        <button
          onClick={handleNotify}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition font-semibold"
        >
          <FaBell /> Notify
        </button>
        <button
          onClick={handleVisitProfile}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 transition font-semibold"
        >
          <FaUser /> Visit Profile
        </button>
      </div>
    </div>
  );
};

export default DonorCard;
