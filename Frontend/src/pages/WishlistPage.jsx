import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "../styles/Wishlist.css";

function WishlistPage() {
  const navigate = useNavigate();
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  
  // Track loading state for UI feedback during API calls
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMoveToCart = async (product) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Add to Cart Backend API
      // Note: product.productId matches the WishlistDTO from Spring
      await addToCart(product.productId, 1); 
      
      // 2. Remove from Wishlist Backend API
      await removeFromWishlist(product.productId);
      
      showToast(`${product.name} moved to cart!`, "success");
    } catch (error) {
      showToast("Could not move item to cart. Please try again.", "error");
      console.error("Move to cart error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      showToast("Item removed from wishlist.", "success");
    } catch (error) {
      showToast("Failed to remove item.", "error");
    }
  };

  return (
    <div className="wishlist-page">
      <MainNavbar />
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h2>My Wishlist</h2>
          <p>{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>

        {items.length === 0 ? (
          <div className="wishlist-empty">
            <div className="empty-icon">♡</div>
            <h3>Your wishlist is empty</h3>
            <p>Save products you love to review them later.</p>
            <button 
              className="browse-btn"
              onClick={() => navigate("/products")}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {items.map((item) => (
              <article key={item.productId} className="wishlist-card">
                <div className="wishlist-image">
                  <img 
                    src={item.image || "/placeholder-product.png"} 
                    alt={item.name} 
                    loading="lazy" 
                  />
                </div>
                <div className="wishlist-body">
                  <h4 title={item.name}>{item.name}</h4>
                  <p className="wishlist-meta">{item.category || "General"}</p>
                  <div className="wishlist-price">
                    ₹{Number(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="wishlist-actions">
                    <button 
                      disabled={isProcessing}
                      onClick={() => handleMoveToCart(item)}
                      className="move-to-cart-btn"
                    >
                      {isProcessing ? "Moving..." : "Move to Cart"}
                    </button>
                    <button 
                      className="ghost" 
                      onClick={() => handleRemove(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;