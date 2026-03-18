import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
import "../styles/CartPage.css";

function CartPage() {
  const {
    items,
    cartId,
    loading,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalEmission,
    subtotal
  } = useCart();

  const navigate = useNavigate();

  if (loading) return (
    <div className="cart-loader">
       <div className="spinner"></div>
       <p>Loading your eco-cart...</p>
    </div>
  );

  if (!items || items.length === 0)
    return (
      <div className="cart-container">
        <MainNavbar />
        <div className="empty-cart-view">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button className="continue-btn" onClick={() => navigate("/products")}>
            Start Shopping
          </button>
        </div>
      </div>
    );

  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="cart-container">
      <MainNavbar />

      <div className="cart-content">
        <div className="cart-items">
          <h2 className="cart-title">My Shopping Cart ({items.length})</h2>

          {items.map((item) => {
            const imageSrc = item.image;
            // ✅ Use the emission directly from backend
            const itemEmission = item.emission || 0;

            return (
              <div key={item.itemId || item.productId} className="cart-item-card">
                <img
                  src={imageSrc || "https://via.placeholder.com/150?text=No+Image"}
                  alt={item.productName}
                  className="cart-product-img"
                />

                <div className="cart-item-details">
                  <div className="item-header">
                      <h3>{item.productName}</h3>
                      <p className="item-category">{item.category || "General"}</p>
                  </div>
                  
                  <div className="item-stats-row">
                    <p className="price">₹{item.price}</p>
                    <p className="item-carbon-tag">
                      <i className="fa-solid fa-leaf"></i> 
                      {/* ✅ FIXED: Removed * quantity here */}
                      {itemEmission.toFixed(2)} kg CO2e
                    </p>
                  </div>

                  <div className="cart-controls">
                      <div className="qty-section">
                      <button
                          className="qty-btn"
                          onClick={() => item.quantity === 1 ? removeFromCart(item.itemId) : updateQuantity(item.productId, -1)}
                      > − </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.productId, 1)}
                      > + </button>
                      </div>

                      <button className="remove-btn" onClick={() => removeFromCart(item.itemId)}>
                        Remove
                      </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <div className="carbon-summary-box">
            <h4><i className="fa-solid fa-cloud"></i> Environmental Impact</h4>
            <div className="summary-row">
              <span>Total Carbon Footprint</span>
              <span className="carbon-value">{totalEmission.toFixed(2)} kg CO2e</span>
            </div>
            <p className="eco-message">
              {totalEmission < 5 ? "🌱 This is a low-impact cart!" : "Consider greener alternatives to lower this score."}
            </p>
          </div>

          <div className="summary-divider"></div>

          <h3>Price Details</h3>
          <div className="summary-row">
            <span>Price ({items.length} items)</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Charges</span>
            <span className={shipping === 0 ? "free-text" : ""}>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
            </span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          
          <button className="checkout-btn" onClick={() => navigate("/checkout", { state: { cartId } })}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;