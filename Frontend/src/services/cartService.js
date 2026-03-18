import api from "./api";

// ================= LOAD CART =================
export async function fetchCart() {
  const res = await api.get("/cart");
  return res.data;
}

// ================= ADD TO CART =================
export async function addToCart(productId, quantity = 1) {
  const res = await api.post("/cart/add", {
    productId,
    quantity,
  });
  return res.data;
}

// ================= REMOVE ITEM =================
export async function removeFromCart(itemId) {
  const res = await api.delete(`/cart/remove/${itemId}`);
  return res.data;
}

// ================= CLEAR CART =================
export async function clearCart() {
  const res = await api.delete("/cart/clear");
  return res.data;
}

// ================= UPDATE QUANTITY =================
export async function updateQuantity(productId, quantityChange) {
  // PATCH request using your UpdateCartRequest DTO
  const res = await api.patch("/cart/update", {
    productId,
    quantityChange, // can be +1 or -1
  });
  return res.data;
}
