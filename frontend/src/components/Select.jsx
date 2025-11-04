const Select = ({ label, options, value, onChange }) => { return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 
                   bg-white text-gray-700 hover:border-red-400 transition"
      >
        <option value="">Select {label}</option>
        {options.map((opt, index) => (
          <option
            key={index}
            value={opt}
            className="hover:bg-red-100 cursor-pointer"
          >
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
