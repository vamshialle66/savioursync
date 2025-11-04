import React, { useState, useRef } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const libraries = ["places"];

const CustomLocationInput = ({ value, onSelect, placeholder }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [predictions, setPredictions] = useState([]);
  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY, // replace with your key
    libraries,
  });

  if (!isLoaded) return <div>Loading maps...</div>;

  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();

    if (!place || !place.formatted_address || !place.geometry) return;

    const { formatted_address } = place;
    const { lat, lng } = place.geometry.location;

    onSelect({
      address: formatted_address,
      lat: lat(),
      lng: lng(),
    });
    setInputValue(formatted_address);
    setPredictions([]);
  };

  return (
    <Autocomplete
      onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
      onPlaceChanged={handlePlaceChanged}
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder || "Enter your location"}
        className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
      />
    </Autocomplete>
  );
};

export default CustomLocationInput;
