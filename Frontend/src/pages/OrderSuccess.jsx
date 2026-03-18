import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import MainNavbar from "../components/MainNavbar";
import "../styles/OrderSuccess.css";

function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  // Redirect if accessed without order data
  useEffect(() => {
    if (!order) {
      navigate("/products");
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="order-success-bg">
      <MainNavbar />
      <div className="success-container">
        <div className="success-card">
          {/* Animated Checkmark */}
          <div className="checkmark-wrapper">
            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>

          <h1>Order Placed Successfully!</h1>
          <p className="order-id">Order ID: <strong>#{order.orderNumber || order.id}</strong></p>
          <p className="success-msg">
            Thank you for your purchase, <strong>{order.fullName || "Customer"}</strong>! 
            A confirmation email has been sent to your registered address.
          </p>

          <div className="order-summary-box">
            <div className="summary-row">
              <span>Items:</span>
              <span>{order.items?.length || 1}</span>
            </div>
            <div className="summary-row">
              <span>Total Paid:</span>
              <span className="total-amt">₹{order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Payment Mode:</span>
              <span className="pay-mode">{order.paymentMethod?.toUpperCase()}</span>
            </div>
          </div>

          <div className="success-actions">
            <button className="view-orders-btn" onClick={() => navigate("/my-orders")}>
              VIEW MY ORDERS
            </button>
            <button className="continue-shop-btn" onClick={() => navigate("/products")}>
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
