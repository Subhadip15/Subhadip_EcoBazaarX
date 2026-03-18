import React, { useState } from "react";
import { useToast } from "../context/ToastContext";
import "../styles/Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = ({ user }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Please enter your email", "error");
      return;
    }
    
    setSubscribing(true);
    // Simulate API call
    setTimeout(() => {
      showToast("Successfully subscribed to newsletter!", "success");
      setEmail("");
      setSubscribing(false);
    }, 1000);
  };

  return (
    <footer className="modern-footer">
      <div className="footer-container">

        {/* Brand + Info */}
        <div className="footer-brand">
          <p className="footer-title">EcoBazaarX</p>
          <span className="footer-subtitle">
            Smarter shopping with sustainability visibility.
          </span>

          {/* Social Icons */}
          <div className="footer-social">
            <a href="https://www.facebook.com/EcoBazaarX" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com/EcoBazaarX" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/EcoBazaarX" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/company/EcoBazaarX" target="_blank" rel="noopener noreferrer" aria-label="Connect with us on LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Links section */}
        <div className="footer-links">
          <h4>Marketplace</h4>
          <a href="/products">Products</a>
          {user && <a href="/cart">Cart</a>}
          {user && <a href="/wishlist">Wishlist</a>}
          {user && <a href="/checkout">Checkout</a>}
        </div>

        <div className="footer-links">
          <h4>Account</h4>
          {user ? (
            <>
              <a href="/dashboard">Dashboard</a>
              <a href="/my-orders">My Orders</a>
              <a href="/insights">Carbon Insights</a>
              {user.role === "ADMIN" && <a href="/admin">Admin Panel</a>}
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/signup">Sign Up</a>
            </>
          )}
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h4>Join our newsletter</h4>
          <p>Get updates about eco products & offers</p>
          <form className="newsletter-box" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribing}
            />
            <button type="submit" disabled={subscribing}>
              {subscribing ? "..." : "Subscribe"}
            </button>
          </form>
        </div>

      </div>

      {/* Bottom line */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} EcoBazaarX. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;