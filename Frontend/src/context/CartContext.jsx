import { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  fetchCart as fetchCartApi,
  addToCart as addToCartApi,
  removeFromCart as removeFromCartApi,
  updateQuantity as updateQuantityApi,
  clearCart as clearCartApi,
} from "../services/cartService";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ✅ FIXED: Only sum the prices (assuming backend sends line-item total)
  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }, [items]);

  // ✅ FIXED: Only sum the emissions to prevent double multiplication (10.80 issue)
  const totalEmission = useMemo(() => {
    return items.reduce((total, item) => {
      return total + (item.emission || 0);
    }, 0);
  }, [items]);

  const fetchCart = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchCartApi();

      const normalizedItems = (data.items || []).map(item => ({
        ...item,
        image: item.image || item.productImage || (item.product && item.product.image) || ""
      }));

      setItems(normalizedItems);
      setCartId(data.cartId || null);
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (productId, quantity) => {
    try {
      await addToCartApi(productId, quantity);
      await fetchCart(); 
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await removeFromCartApi(itemId);
      await fetchCart(); 
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  const updateQuantity = async (productId, change) => {
    try {
      await updateQuantityApi(productId, change);
      await fetchCart(); 
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  const clearCart = async () => {
    try {
      await clearCartApi();
      setItems([]);
      setCartId(null);
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,       
        totalEmission,   
        cartId,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};