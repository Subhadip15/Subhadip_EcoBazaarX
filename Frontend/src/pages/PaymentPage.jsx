import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MainNavbar from "../components/MainNavbar";
import { useToast } from "../context/ToastContext";
import "../styles/PaymentPage.css";

function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // orderId is usually what the backend needs for the URL
  const order = state?.order;

  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: ""
  });

  // Redirect if someone tries to access /payment directly without an order
  useEffect(() => {
    if (!order) {
      showToast("No active order session found", "error");
      navigate("/products");
    }
  }, [order, navigate, showToast]);

  if (!order) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (order.paymentMethod === "card" || order.paymentMethod === "upi") {
      showToast("This service will be available soon.", "info");
      setProcessing(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      // Match the backend endpoint you likely have
      // Using order.id or order.orderId depending on your DTO
      const response = await fetch(`http://localhost:8080/api/orders/pay/${order.id || order.orderId}`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          paymentMethod: order.paymentMethod,
          paymentDetails: formData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment declined by bank");
      }

      showToast("Payment Successful! Your order is being processed.", "success");
      
      // Navigate to success page with order details
      navigate("/order-success", { state: { order } });
      
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-page-bg">
      <MainNavbar />
      <div className="payment-container">
        
        {/* LEFT: Payment Methods */}
        <div className="payment-left">
          <div className="payment-card-panel">
            <div className="panel-header">
              <span className="step-count">4</span>
              <h2>Payment Options</h2>
            </div>

            <div className="payment-content">
              <form onSubmit={handlePayment}>
                {order.paymentMethod === "card" && (
                  <div className="card-input-group">
                    <p className="helper-text">Card service will be available soon.</p>
                    <p className="input-label">Credit / Debit Card Details</p>
                    <input 
                      type="text" 
                      name="cardNumber"
                      placeholder="XXXX XXXX XXXX XXXX" 
                      required 
                      maxLength="16"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                    />
                    <div className="form-row">
                      <input 
                        type="text" 
                        name="expiry"
                        placeholder="MM/YY" 
                        required 
                        maxLength="5" 
                        value={formData.expiry}
                        onChange={handleInputChange}
                      />
                      <input 
                        type="password" 
                        name="cvv"
                        placeholder="CVV" 
                        required 
                        maxLength="3" 
                        value={formData.cvv}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {order.paymentMethod === "upi" && (
                  <div className="upi-input-group">
                    <p className="helper-text">UPI service will be available soon.</p>
                    <p className="input-label">Your UPI ID</p>
                    <input 
                      type="text" 
                      name="upiId"
                      placeholder="username@bankid" 
                      required 
                      value={formData.upiId}
                      onChange={handleInputChange}
                    />
                    <p className="helper-text">Pay using any UPI App (PhonePe, Google Pay, etc.)</p>
                  </div>
                )}

                <button type="submit" className="pay-now-btn" disabled={processing}>
                  {processing ? "PROCESSING..." : `PAY ₹${order.totalAmount.toLocaleString()}`}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT: Order Summary Sidebar */}
        <aside className="payment-sidebar">
          <div className="price-details">
            <h3>Order Summary</h3>
            <div className="price-row">
              <span>Order ID</span>
              <span>#{order.orderNumber || order.id}</span>
            </div>
            <div className="price-row">
              <span>Total Items</span>
              <span>{order.items?.length || 1}</span>
            </div>
            <hr />
            <div className="total-amount">
              <span>Total Payable</span>
              <span>₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
          <div className="secure-badge">
            🛡️ Safe and Secure Payments. 100% Authentic products.
          </div>
        </aside>

      </div>
    </div>
  );
}

export default PaymentPage;
