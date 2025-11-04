import React, { useState, useRef } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

const LocationInput = ({ value, onSelect }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const autocompleteRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading maps...</div>;

  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();

    // Safety check
    if (!place || !place.formatted_address || !place.geometry) {
      console.warn("Place is undefined or incomplete");
      return;
    }

    onSelect({
      address: place.formatted_address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setInputValue(place.formatted_address);
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
        placeholder="Enter your city"
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
      />
    </Autocomplete>
  );
};

export default LocationInput;
