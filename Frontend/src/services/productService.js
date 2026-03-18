import api from "./api";

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
      throw new Error("Endpoint not found. Check backend mapping.");
    }
    if (status === 400) {
      throw new Error(error.response.data?.message || "Invalid data provided. Check numbers/fields.");
    }

    throw new Error(
      error.response.data?.message ||
      error.response.data?.error ||
      fallbackMessage
    );
  }
  throw new Error(`Connection to ${api?.defaults?.baseURL || "the backend"} failed. Is the backend running?`);
}

/* ================= API FUNCTIONS ================= */

/**
 * Fetch all products
 */
export async function getProducts() {
  try {
    const res = await api.get("/products");
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    handleError(error, "Failed to load products");
  }
}

/**
 * Get single product by ID
 */
export async function getProductById(id) {
  try {
    const res = await api.get(`/product/${id}`);
    return res.data;
  } catch (error) {
    handleError(error, "Product not found");
  }
}

/**
 * Search products by keyword
 */
export async function searchProducts(keyword) {
  try {
    const res = await api.get("/products/search", { params: { keyword } });
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    handleError(error, "Search failed");
  }
}

/**
 * CREATE PRODUCT (ADMIN)
 * Accepts the flat ProductRequest DTO
 */
export async function createProduct(productDTO) {
  try {
    const res = await api.post("/product", productDTO);
    return res.data;
  } catch (error) {
    handleError(error, "Failed to create product");
  }
}

/**
 * UPDATE PRODUCT (ADMIN)
 * Accepts ID and the flat ProductRequest DTO
 */
export async function updateProduct(id, productDTO) {
  try {
    const res = await api.put(`/product/${id}`, productDTO);
    return res.data;
  } catch (error) {
    handleError(error, "Failed to update product");
  }
}

/**
 * DELETE PRODUCT (ADMIN)
 */
export async function deleteProduct(id) {
  try {
    const res = await api.delete(`/product/${id}`);
    return res.data;
  } catch (error) {
    handleError(error, "Failed to delete product");
  }
}
