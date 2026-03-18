import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../services/authService";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const data = await forgotPassword(email);
      const serverMessage = data?.message || "OTP sent";
      setMessage(serverMessage);
      setStep(2);
    } catch {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword({ email, otp, newPassword });
      const serverMessage = data?.message || "Password reset";
      if (serverMessage.toLowerCase().includes("successful")) {
        setMessage(serverMessage);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(serverMessage);
      }
    } catch {
      setError("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-theme auth-page">
      <div className="forgot-shell">
        <aside className="forgot-aside">
          <p className="auth-kicker">Account Recovery</p>
          <h1>Recover access in two steps.</h1>
          <p>
            We will verify your email with OTP, then you can set a secure new password.
          </p>
          <div className="recovery-steps">
            <span className={step === 1 ? "active" : ""}>1. Verify Email</span>
            <span className={step === 2 ? "active" : ""}>2. Reset Password</span>
          </div>
        </aside>

        <div className="forgot-card">
          <h2>Forgot Password</h2>
          <p className="auth-sub">Enter your details to continue account recovery.</p>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="back-link" onClick={() => navigate("/login")}>
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
