import React from "react";
import "../styles/Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
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
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Links section */}
        <div className="footer-links">
          <h4>Marketplace</h4>
          <a href="/products">Products</a>
          <a href="/cart">Cart</a>
          <a href="/checkout">Checkout</a>
        </div>

        <div className="footer-links">
          <h4>About</h4>
          <a href="/about">Our Story</a>
          <a href="/terms">Terms of Use</a>
          <a href="/privacy">Privacy Policy</a>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h4>Join our newsletter</h4>
          <p>Get updates about eco products & offers</p>
          <div className="newsletter-box">
            <input type="email" placeholder="Your email" />
            <button>Subscribe</button>
          </div>
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