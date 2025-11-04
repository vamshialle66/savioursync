import React from "react";
import CustomLocationInput from "./CustomLocationInput";
import Select from "../../components/Select";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const organs = ["Kidney", "Liver", "Heart", "Lungs", "Pancreas", "Eyes"];

const SearchBar = ({
  locationValue,
  onLocationSelect,
  type,
  onTypeChange,
  value,
  onValueChange,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto bg-white p-5 rounded-3xl shadow-lg flex flex-col md:flex-row gap-3 items-center"
      style={{ maxWidth: "800px" }} // compact width
    >
      {/* Location Input */}
      <div className="flex-1 min-w-[150px]">
        <CustomLocationInput
          value={locationValue}
          onSelect={onLocationSelect}
          placeholder="City or Location"
        />
      </div>

      {/* Type Dropdown */}
      <div className="w-full md:w-32">
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <option value="blood">Blood</option>
          <option value="organ">Organ</option>
        </select>
      </div>

      {/* Value Dropdown */}
      <div className="w-full md:w-32">
        <Select
          options={type === "blood" ? bloodGroups : organs}
          value={value}
          onChange={onValueChange}
        />
      </div>

      {/* Search Button */}
      <div className="w-full md:w-auto">
        <button
          type="submit"
          className="w-full md:w-auto bg-red-400 text-white py-3 px-6 rounded-xl font-bold hover:bg-red-500 transition"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
