import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // optional for a nice icon

const AdminHeaderLink = ({ text = "Back to Dashboard" }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/admin/dashboard")}
      className="cursor-pointer flex items-center gap-2 text-red-700 font-semibold hover:text-red-900 transition mb-4"
    >
      <FaArrowLeft />
      {text}
    </div>
  );
};

export default AdminHeaderLink;
