import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = "http://localhost:8080/api/wishlist";

  const getAuthHeaders = useCallback(() => ({
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  }), []);

  const fetchWishlist = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(API_URL, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) => {
    return items.some((item) => String(item.productId) === String(productId));
  };

  const addToWishlist = async (product) => {
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        }),
      });
      if (response.ok) {
        const newItem = await response.json();
        setItems((prev) => [...prev, newItem]);
      }
    } catch (error) {
      console.error("Add failed:", error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/remove/${productId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setItems((prev) => prev.filter((item) => String(item.productId) !== String(productId)));
      }
    } catch (error) {
      console.error("Remove failed:", error);
    }
  };

  // ✅ NEW: The Toggle function required by ProductCatalog
  const toggleWishlist = async (product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider value={{ items, loading, toggleWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);