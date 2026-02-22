import axios from "axios";

const API_URL = "http://localhost:8080/api";

/**
 * Helper to get Auth Headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

/**
 * GET - All products from database
 */
export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error.response?.data || "Could not fetch products";
  }
};

/**
 * GET - Single product by ID (This was missing!)
 * Matches: GET /api/product/{id}
 */
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/product/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error.response?.data || "Product not found";
  }
};

/**
 * POST - Create product (Admin only)
 */
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(
      `${API_URL}/product`,
      productData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to create product";
  }
};

/**
 * PUT - Update product (Admin only)
 */
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(
      `${API_URL}/product/${id}`,
      productData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to update product";
  }
};

/**
 * DELETE - Remove product (Admin only)
 */
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/product/${id}`, 
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to delete product";
  }
};

/**
 * SEARCH - Search products
 */
export const searchProducts = async (keyword) => {
  try {
    const response = await axios.get(`${API_URL}/products/search`, {
      params: { keyword },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Search failed";
  }
};