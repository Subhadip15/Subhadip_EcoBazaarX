import { useEffect, useState } from "react";
import MainNavbar from "../components/MainNavbar";
import { fetchOrdersApi } from "../services/orderService";
import "../styles/MyOrders.css"; // Ensure you create this CSS file

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrdersApi();
        // Assuming data is an array, reverse it to show newest first
        setOrders(Array.isArray(data) ? data.reverse() : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="orders-page-wrapper">
      <MainNavbar />
      
      <main className="orders-content">
        <h2 className="page-title">My Orders</h2>

        {loading ? (
          <div className="state-msg">
            <div className="loader"></div>
            <p>Fetching your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="state-msg empty-state">
            <img 
              src="https://static.vecteezy.com/system/resources/thumbnails/005/006/007/small/no-item-in-the-shopping-cart-click-to-go-shopping-now-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg" 
              alt="Empty Cart" 
              style={{ width: '200px', marginBottom: '20px' }}
            />
            <p>You have no orders yet.</p>
            <button className="shop-now-btn" onClick={() => window.location.href='/products'}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <section key={order.orderId || order._id} className="order-card">
                <header className="order-card-header">
                  <div className="order-id-group">
                    <span className="label">ORDER ID:</span>
                    <span className="id-value"> #{order.orderNumber || (order.orderId || order._id).slice(-8).toUpperCase()}</span>
                  </div>
                  <div className={`status-pill ${order.status?.toLowerCase()}`}>  
                    <p>STATUS: {order.status || "Processing"}</p>
                  </div>
                </header>

                <div className="order-body">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <div className="item-main-info">
                        <p className="item-name"> PRODUCT NAME: {item.productName}</p>
                        <p className="item-qty"> QUANTITY: {item.quantity}</p>
                      </div>
                      <div className="order-date">
                    PLACED ON: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
                  </div>
                      <div className="item-price">
                        <p>Total Amount: ₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <footer className="order-card-footer">
                  <div className="order-total-summary">
                    <strong>{order.total?.toFixed(2)}</strong>
                  </div>
                </footer>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyOrders;


