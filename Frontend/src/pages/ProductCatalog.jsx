import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";
import { getProducts } from "../services/productService";
import "../styles/ProductCatalog.css";

function ProductCatalog({ user }) {
  const navigate = useNavigate();
  const { items: cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Data States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [ecoFriendlyOnly, setEcoFriendlyOnly] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setApiError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Generate unique categories for the dropdown
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category);
    return ["All", ...new Set(cats)];
  }, [products]);

  // The "Everything" Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Bar (Name or Category)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term)
      );
    }

    // 2. Category Dropdown
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 3. Eco Friendly Toggle
    if (ecoFriendlyOnly) {
      result = result.filter((p) => p.isEcoFriendly);
    }

    // 4. Price Sorting
    if (sortOrder === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortOrder, ecoFriendlyOnly]);

  const getCartQuantity = (productId) => {
    return cartItems.find((i) => i.productId === productId)?.quantity || 0;
  };

  const handleAddToCart = async (product) => {
    try {
      const qty = getCartQuantity(product.id);
      if (qty) await updateQuantity(product.id, 1);
      else await addToCart(product.id, 1);
      showToast(`${product.name} added to cart.`, "success");
    } catch {
      showToast("Failed to add item.", "error");
    }
  };

  const handleDecrease = async (product) => {
    const cartItem = cartItems.find((i) => i.productId === product.id);
    if (!cartItem) return;
    if (cartItem.quantity === 1) await removeFromCart(cartItem.itemId);
    else await updateQuantity(product.id, -1);
  };

  return (
    <main className="catalog-page">
      <MainNavbar />
      
      <div className="catalog-header-section">
  <div className="header-container" style={{ 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "space-between", 
    gap: "20px",
    flexWrap: "nowrap" /* Ensures everything stays in one line */
  }}>
    
    {/* 1. Title Group */}
    <div className="title-group" style={{ minWidth: "fit-content" }}>
      <h1 style={{ fontSize: "16px" }}>All Products</h1>
      <p style={{ fontSize: "11px", margin: 0 }}>{filteredProducts.length} items</p>
    </div>

    {/* 2. Search Bar - Flex 1 allows it to take up remaining middle space */}
    <div className="search-container" style={{ flex: 2, position: "relative" }}>
      <input 
        type="text"
        placeholder="Search for products..."
        className="main-search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 16px",
          border: "1px solid #dbdbdb",
          borderRadius: "2px",
          fontSize: "14px",
          outline: "none",
          boxShadow: "0 2px 4px 0 rgba(0,0,0,.08)"
        }}
      />
    </div>

    {/* 3. Filters Group - Wrapped in a div to keep them together */}
    <div className="filter-controls" style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "15px", 
      background: "none", 
      padding: 0, 
      margin: 0, 
      boxShadow: "none" 
    }}>
      <div className="filter-group">
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ padding: "6px" }}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ padding: "6px" }}>
          <option value="default">Sort By</option>
          <option value="low-high">Price: Low-High</option>
          <option value="high-low">Price: High-Low</option>
        </select>
      </div>

      <div className="filter-group checkbox-group" style={{ marginTop: 0, display: "flex", alignItems: "center" }}>
        <input 
          type="checkbox" 
          id="eco" 
          checked={ecoFriendlyOnly} 
          onChange={(e) => setEcoFriendlyOnly(e.target.checked)} 
        />
        <label htmlFor="eco" style={{ fontSize: "12px", marginLeft: "4px", whiteSpace: "nowrap" }}>🌱 Eco</label>
      </div>
    </div>

    {/* 4. Admin Button */}
    {user?.role === "ADMIN" && (
      <button className="fk-add-btn" onClick={() => navigate("/add-product")} style={{ whiteSpace: "nowrap", padding: "8px 15px" }}>
        + ADD
      </button>
    )}
  </div>
</div>

      {apiError && <div className="error-banner" style={{ textAlign: "center", color: "red", padding: "20px" }}>{apiError}</div>}
      
      {loading ? (
        <div className="loading-state" style={{ textAlign: "center", padding: "100px" }}>
           <div className="spinner"></div>
           <p>Loading Products...</p>
        </div>
      ) : (
        <section className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => {
              const quantityInCart = getCartQuantity(p.id);
              return (
                <article key={p.id} className="product-card">
                  {user?.role === "ADMIN" && (
                    <div className="admin-actions">
                      <button className="edit-badge" onClick={() => navigate(`/edit-product/${p.id}`)}>
                        ✎ EDIT
                      </button>
                    </div>
                  )}

                  <div className="img-container">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      loading="lazy" 
                      onError={(e) => (e.currentTarget.src = "https://dummyimage.com/400x400/f0f0f0/2874f0&text=No+Image")} 
                    />
                  </div>

                  <div className="product-body">
                    <h3 title={p.name}>{p.name}</h3>
                    <div className="badge-row">
                      <span className="category-pill">{p.category}</span>
                      {p.isEcoFriendly && <span className="eco-tag">🌱 Eco Choice</span>}
                    </div>
                    
                    <div className="price-row">
                      <span className="final-price">₹{p.price.toFixed(2)}</span>
                      <button
                        className={`wishlist-btn ${isInWishlist(p.id) ? "active" : ""}`}
                        onClick={() => toggleWishlist(p)}
                        title={isInWishlist(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        {isInWishlist(p.id) ? "♥" : "♡"}
                      </button>
                    </div>

                    <div className="card-actions">
                      {quantityInCart > 0 ? (
                        <div className="qty-control">
                          <button onClick={() => handleDecrease(p)}>−</button>
                          <span style={{ padding: "0 10px", fontWeight: "bold" }}>{quantityInCart}</span>
                          <button onClick={() => handleAddToCart(p)}>+</button>
                        </div>
                      ) : (
                        <button className="cart-btn" onClick={() => handleAddToCart(p)}>
                           ADD TO CART
                        </button>
                      )}
                    </div>
                    
                    <Link className="impact-link" to={`/products/${p.id}`}>
                      VIEW ECO IMPACT
                    </Link>
                  </div>
                </article>
              );
            })
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "50px", background: "#fff" }}>
              <h3>No products found matching your criteria.</h3>
              <button 
                onClick={() => {setSearchTerm(""); setSelectedCategory("All"); setEcoFriendlyOnly(false);}}
                style={{ color: "var(--fk-blue)", border: "none", background: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default ProductCatalog;
