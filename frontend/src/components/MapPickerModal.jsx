import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { FaTimes } from "react-icons/fa";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 19.0760, // Default to Mumbai
  lng: 72.8777,
};

const MapPickerModal = ({ onSelect, onClose }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  });

  const [marker, setMarker] = useState(null);

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-11/12 max-w-2xl relative shadow-lg p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
        >
          <FaTimes size={20} />
        </button>

        {/* Map */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onClick={handleMapClick}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>

        {/* Pick Location Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              if (!marker) return; // Prevent picking if no marker
              onSelect(marker.lat, marker.lng);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-semibold disabled:opacity-50"
            disabled={!marker}
          >
            Pick Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPickerModal;
