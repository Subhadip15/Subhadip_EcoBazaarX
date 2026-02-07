import { logout, getStoredUser } from "../services/authService";
import "../styles/Dashboard.css";

function Dashboard({ onLogout }) {
  const user = getStoredUser();

  const handleLogout = () => {
    logout();
    onLogout();
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Welcome to EcoBazar!</h2>
        <div className="user-info">
          <h3>User Profile</h3>
          <div className="info-row">
            <span className="label">Name:</span>
            <span className="value">{user.name}</span>
          </div>
          <div className="info-row">
            <span className="label">Email:</span>
            <span className="value">{user.email}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
