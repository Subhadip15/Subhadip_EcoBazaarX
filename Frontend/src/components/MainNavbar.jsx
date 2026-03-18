import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { logout, getStoredUser } from "../services/authService";
import "../styles/MainNavbar.css";

function MainNavbar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [] } = useCart();
  const user = getStoredUser();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();   // App.js state update
    }
    navigate("/login");
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => setShowProfileDetails(false), 300);
  };

  return (
    <>
      <nav className="main-nav">
        <div className="main-nav-shell">
          <Link to="/dashboard" className="brand">EcoBazaarX</Link>

          <div className="main-nav-links">
            <Link className={isActive("/dashboard") ? "active" : ""} to="/dashboard">Home</Link>
            <Link className={isActive("/products") ? "active" : ""} to="/products">Catalog</Link>
            <Link className={isActive("/insights") ? "active" : ""} to="/insights">Insights</Link>
            {user?.role === "ADMIN" && (
              <Link className={isActive("/admin") ? "active" : ""} to="/admin">Admin</Link>
            )}
            <Link className={isActive("/cart") ? "active" : ""} to="/cart">
              <div className="cart-link-content">
                {/* 🆕 FontAwesome Cart Icon */}
                <i className="fa-solid fa-cart-shopping"></i>
                <span>Cart</span>
                <span className="cart-badge">{items.length}</span>
              </div>
            </Link>
          </div>

          <div className="navbar-right">
            <div className="profile-icon" onClick={() => setIsSidebarOpen(true)}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </div>
      </nav>

      {/* Side Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}

      {/* Side Sidebar */}
      <div className={`side-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>{showProfileDetails ? "User Profile" : "Account Settings"}</h3>
          <button className="close-btn" onClick={closeSidebar}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="sidebar-content">
          {!showProfileDetails ? (
            /* --- VIEW 1: MAIN NAVIGATION --- */
            <div className="menu-view fade-in">
              <button className="sidebar-link" onClick={() => setShowProfileDetails(true)}>
                <span className="icon"><i className="fa-solid fa-user-gear"></i></span> My Profile
              </button>

              <Link to="/my-orders" className="sidebar-link" onClick={closeSidebar}>
                <span className="icon"><i className="fa-solid fa-box-archive"></i></span> My Orders
              </Link>

              <Link to="/checkout" className="sidebar-link" onClick={closeSidebar}>
                <span className="icon"><i className="fa-solid fa-location-dot"></i></span> Manage Addresses
              </Link>

              <Link to="/wishlist" className="sidebar-link" onClick={closeSidebar}>
                <span className="icon"><i className="fa-solid fa-heart"></i></span> Wishlist
              </Link>

              <div className="sidebar-divider" />

              <button className="sidebar-link logout-link" onClick={handleLogout}>
                <span className="icon"><i className="fa-solid fa-right-from-bracket"></i></span> Logout
              </button>
            </div>
          ) : (
            /* --- VIEW 2: PROFILE DETAILS --- */
            <div className="profile-view fade-in">
              {/* 🆕 Improved Back Link with FontAwesome Arrow */}
              <button className="sidebar-link back-link" onClick={() => setShowProfileDetails(false)}>
                <span className="icon"><i className="fa-solid fa-chevron-left"></i></span> Back
              </button>

              <div className="sidebar-user-info">
                <div className="user-avatar-large">
                  {user?.image ? (
                    <img src={user.image} alt={user.name} />
                  ) : (
                    <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                  )}
                </div>
                <div className="user-details-group">
                  <h4 className="user-name-title">{user?.name || "Eco User"}</h4>
                  <p className="user-email-text">{user?.email || "No email available"}</p>
                  <span className="user-role-badge">{user?.role || "USER"}</span>
                </div>
              </div>

              <div className="sidebar-divider" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MainNavbar;
