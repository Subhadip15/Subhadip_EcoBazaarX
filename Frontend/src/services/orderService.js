// src/services/orderService.js
import api from "./api";

// ================= PLACE ORDER =================
/**
 * Place a new order
 * @param {Object} orderData - Structure:
 * {
 * addressId: number | null,
 * newAddress: { fullName, street, city, state, zipCode } | null,
 * items: Array,
 * totalAmount: number,
 * paymentMethod: string,
 * totalEmission: number
 * }
 */
export async function placeOrderApi(orderData) {
  try {
    // Note: If your Controller uses @PostMapping("/place"), keep /place
    // If it uses @PostMapping(""), change to API_URL
    const response = await api.post("/orders/place", orderData);
    
    return response.data;
  } catch (error) {
    // 🔍 ENHANCED LOGGING:
    // This allows you to see exactly why the Backend threw a 500 error
    if (error.response) {
      console.error("Backend Error Status:", error.response.status);
      console.error("Backend Error Message:", error.response.data);
    } else {
      console.error("Network/Request Error:", error.message);
    }
    
    // Throw the specific message back to the UI Toast
    throw error.response?.data || { message: "Failed to connect to order server" };
  }
}

// ================= FETCH USER ORDERS =================
/**
 * Fetch all orders for the logged-in user
 */
export async function fetchOrdersApi() {
  try {
    const response = await api.get("/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch orders" };
  }
}

// ================= FETCH SINGLE ORDER =================
/**
 * Fetch single order by ID
 */
export async function fetchOrderById(orderId) {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order detail:", error.response?.data || error.message);
    throw error.response?.data || { message: "Order not found" };
  }
}
