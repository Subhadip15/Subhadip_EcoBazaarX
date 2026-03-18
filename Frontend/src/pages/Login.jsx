import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../styles/Login.css";

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // Login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { token, user } = await login(formData); // updated destructuring
      if (!token || !user) throw new Error("Invalid email or password");
      
      onLoginSuccess(user); // pass user only, keep your existing logic
      navigate("/dashboard"); 
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-theme">
      <div className="auth-shell">
        <aside className="auth-showcase">
          <p className="auth-kicker">Sustainable Marketplace</p>
          <h1>Welcome back to smarter eco shopping.</h1>
          <p>
            Compare product emissions, discover greener alternatives, and checkout with full
            carbon visibility.
          </p>
          <div className="showcase-points">
            <span>Live CO2 summary</span>
            <span>Smart cart suggestions</span>
            <span>Secure account access</span>
          </div>
        </aside>

        <div className="auth-card">
          <h2>Login</h2>
          <p className="auth-sub">Access your account to continue shopping.</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p
            className="forgot-link"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>

          <p>
            Don’t have an account?{" "}
            <span onClick={() => navigate("/signup")}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
