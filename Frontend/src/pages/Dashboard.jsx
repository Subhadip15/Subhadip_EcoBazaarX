import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { logout, getStoredUser } from "../services/authService";
import "../styles/Dashboard.css";

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const user = getStoredUser();
  const { totalItems, items = [] } = useCart();
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
      <MainNavbar onLogout={handleLogout} />

      {/* Dashboard Content with Background Image Link */}
      <div className="dashboard-container">
        <img src="https://ecobazar-ecommerce.vercel.app/_next/image?url=%2Fimages%2FBannar.png&w=3840&q=75" alt="" className="background-image" />
       
        <div className="content-overlay">
          <p className="hero-kicker">Commerce Control Center</p>
          <h2>Welcome to EcoBazar, {user?.name || "User"}.</h2>
          <p>
            Manage products, track sustainability signals, and continue to Smart Cart with
            live emissions visibility.
          </p>
          {/* <div className="quick-stats">
            <div>
              <span>Current Role</span>
              <strong>{user?.role || "USER"}</strong>
            </div>
            <div>
              <span>Cart Items</span>
              <strong>{totalItems}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>Active</strong>
            </div>
          </div> */}
          <div className="dashboard-actions">
            <button
              className="open-catalog-btn"
              onClick={() => navigate("/products")}
            >
              Open Product Catalog
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
