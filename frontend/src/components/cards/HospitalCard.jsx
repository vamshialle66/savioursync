import React, { useState } from "react";
import { FaHospital, FaMapMarkerAlt, FaPhone, FaGlobe } from "react-icons/fa";

const HospitalCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const handleCall = () => {
    if (item.contact) window.open(`tel:${item.contact}`);
  };

  const googleMapsLink =
    item.locationCoords?.coordinates?.length === 2
      ? `https://www.google.com/maps/search/?api=1&query=${item.locationCoords.coordinates[1]},${item.locationCoords.coordinates[0]}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-5 border-l-8 border-green-500 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-green-100 text-green-600 p-3 rounded-full">
          <FaHospital size={20} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
      </div>

      {/* Location */}
      {item.location && (
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 text-sm font-medium"
        >
          <FaMapMarkerAlt /> {item.location}
        </a>
      )}

      {/* Contact */}
      {item.contact && (
        <div className="text-gray-700 text-sm font-medium">
          📞 {item.contact}
        </div>
      )}

      {/* Expandable Inventory */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-green-600 font-semibold text-sm hover:underline self-start"
      >
        {expanded ? "Hide Inventory ▲" : "View Inventory ▼"}
      </button>

      {expanded && (
        <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-700 mt-2">
          {/* Blood Inventory */}
          {item.bloodInventory && (
            <div>
              <h4 className="font-bold text-green-600 mb-1">Blood Inventory</h4>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(item.bloodInventory).map(([group, qty]) => (
                  <div key={group} className="flex justify-between">
                    <span>{group}</span>
                    <span className="font-semibold">{qty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organ Inventory */}
          {item.organInventory && (
            <div>
              <h4 className="font-bold text-green-600 mb-1">Organ Inventory</h4>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(item.organInventory).map(([organ, qty]) => (
                  <div key={organ} className="flex justify-between">
                    <span>{organ}</span>
                    <span className="font-semibold">{qty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Buttons */}
      <div className="flex gap-3 mt-3">
        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition font-semibold"
        >
          <FaPhone /> Call
        </button>
        <button
          onClick={() => window.open(item.website || "#", "_blank")}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 transition font-semibold"
        >
          <FaGlobe /> Website
        </button>
      </div>
    </div>
  );
};

export default HospitalCard;
