const API_URL = "http://localhost:8080"; // Spring Boot default port

export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/addUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/loginUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const isValid = await response.json();

    if (!response.ok) {
      throw new Error("Login failed");
    }

    if (isValid) {
      localStorage.setItem("user", JSON.stringify(credentials)); // store email for session
    }

    return isValid;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("user");
};
