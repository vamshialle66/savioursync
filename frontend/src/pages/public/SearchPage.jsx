import React, { useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "../../components/search/SearchBar";
import ResultCard from "../../components/cards/ResultCard";

const SearchPage = () => {
  const [locationValue, setLocationValue] = useState("");
  const [coords, setCoords] = useState(null);
  const [type, setType] = useState("blood");
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!coords || !value) {
      setError("Please select a location and value.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = new URL("http://localhost:5000/api/search");
      url.searchParams.append("lat", coords.lat);
      url.searchParams.append("lng", coords.lng);
      url.searchParams.append("type", type);
      url.searchParams.append("value", value);

      const res = await fetch(url.toString());
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch results");
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6 pt-36"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <h2 className="text-3xl font-bold text-center mb-6 text-red-700">
        Search Donors, Blood Banks & Hospitals
      </h2>

      {/* Search Bar */}
      <SearchBar
        locationValue={locationValue}
        onLocationSelect={(loc) => {
          setLocationValue(loc.address);
          setCoords({ lat: loc.lat, lng: loc.lng });
        }}
        type={type}
        onTypeChange={(val) => {
          setType(val);
          setValue("");
        }}
        value={value}
        onValueChange={(e) => setValue(e.target.value)}
        onSubmit={handleSearchSubmit}
      />

      {/* Loading / Error */}
      {loading && <p className="text-red-400 text-center animate-pulse mt-6">Loading results...</p>}
      {error && <p className="text-red-400 text-center mt-6">{error}</p>}

      {/* Results */}
      {results.length > 0 && (
        <div className="max-w-7xl mx-auto mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => (
            <ResultCard key={item._id || item.id || item.name} item={item} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SearchPage;