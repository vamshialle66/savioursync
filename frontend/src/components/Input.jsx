const Input = ({ label, type = "text", value, onChange, placeholder }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500
                   bg-white text-gray-700 hover:border-red-400 transition"
      />
    </div>
  );
};

export default Input;
