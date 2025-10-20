import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import Navbar from "../../components/Navbar";
import Banner from "../../components/Banner";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function LoggedIn() {
  const { user, logout } = useContext(AuthContext); // Get user & logout from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call logout from context
    navigate("/"); // Redirect to Home page after logout
  };

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <Banner user={user} />
      {/* Additional content can be added here */}
    </div>
  );
}

export default LoggedIn;