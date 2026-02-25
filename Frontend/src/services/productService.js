import axios from "axios";

/* ================= API CONFIG ================= */

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const PRODUCT_API_URL = `${API_BASE_URL}/api`;

/* ================= AUTH HEADERS ================= */

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };
}

/* ================= ERROR HANDLER ================= */

function handleError(error, fallbackMessage) {
  if (error.response) {
    const status = error.response.status;

    if (status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (status === 403) {
      throw new Error("Access denied. Admin privileges required.");
    }

    if (status === 404) {
      throw new Error("API route not found. Check backend endpoint.");
    }

    throw new Error(
      error.response.data?.message ||
      error.response.data?.error ||
      fallbackMessage
    );
  }

  throw new Error(
    `Cannot connect to backend at ${API_BASE_URL}. Is server running?`
  );
}

/* ================= GET ALL PRODUCTS ================= */

export async function getProducts() {
  try {
    const res = await axios.get(`${PRODUCT_API_URL}/products`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    handleError(error, "Failed to load products");
  }
}

/* ================= GET PRODUCT BY ID ================= */

export async function getProductById(id) {
  try {
    const res = await axios.get(`${PRODUCT_API_URL}/product/${id}`);
    return res.data;
  } catch (error) {
    handleError(error, "Product not found");
  }
}

/* ================= CREATE PRODUCT (ADMIN) ================= */

export async function createProduct(productData) {
  try {
    const res = await axios.post(
      `${PRODUCT_API_URL}/product`,
      productData,
      getAuthHeaders()
    );
    return res.data;
  } catch (error) {
    handleError(error, "Failed to create product");
  }
}

/* ================= UPDATE PRODUCT (ADMIN) ================= */

export async function updateProduct(id, productData) {
  try {
    const res = await axios.put(
      `${PRODUCT_API_URL}/product/${id}`,
      productData,
      getAuthHeaders()
    );
    return res.data;
  } catch (error) {
    handleError(error, "Failed to update product");
  }
}

/* ================= DELETE PRODUCT (ADMIN) ================= */

export async function deleteProduct(id) {
  try {
    const res = await axios.delete(
      `${PRODUCT_API_URL}/product/${id}`,
      getAuthHeaders()
    );
    return res.data;
  } catch (error) {
    handleError(error, "Failed to delete product");
  }
}

/* ================= SEARCH PRODUCTS ================= */

export async function searchProducts(keyword) {
  try {
    const res = await axios.get(`${PRODUCT_API_URL}/products/search`, {
      params: { keyword }
    });
    return res.data;
  } catch (error) {
    handleError(error, "Search failed");
  }
}