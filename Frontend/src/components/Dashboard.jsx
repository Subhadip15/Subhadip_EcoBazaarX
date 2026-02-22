import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getStoredUser } from "../services/authService";
import "../styles/Dashboard.css";

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    onLogout();
    navigate("/login");
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <h2>EcoBazar</h2>
        </div>

        <div className="navbar-right">
          <div className="profile-wrapper">
            <div
              className="profile-icon"
              onClick={() => setShowProfile(!showProfile)}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            {showProfile && (
              <div className="profile-dropdown">
                <p><strong>Name:</strong> {user?.name || "-"}</p>
                <p><strong>Email:</strong> {user?.email || "-"}</p>
                <p><strong>Phone:</strong> {user?.phone || "-"}</p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Dashboard Content with Background Image Link */}
      <div className="dashboard-container">
        <a 
          href="https://ecobazar-ecommerce.vercel.app/_next/image?url=%2Fimages%2FBannar.png&w=3840&q=75" 
          target="_blank" 
          rel="noopener noreferrer"
          className="background-link"
        >
          <div className="background-image"></div>
        </a>
        <div className="content-overlay">
          <h2>Welcome to EcoBazar!</h2>
          <p>Manage eco product catalog, carbon footprint, and sustainability insights.</p>
          <button
            className="open-catalog-btn"
            onClick={() => navigate("/products")}
          >
            Open Product Catalog Page
          </button>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
