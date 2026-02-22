const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
const API_URL = `${API_BASE_URL}/user`;

const parseErrorResponse = async (response, fallbackMessage) => {
  try {
    const errorData = await response.json();
    return errorData.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

// ------------------- SIGNUP
export const signup = async (userData) => {
  let response;
  try {
    response = await fetch(`${API_URL}/addUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
  } catch {
    throw new Error(
      `Cannot reach backend API at ${API_BASE_URL}. Ensure backend is running and CORS is enabled.`
    );
  }

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, "Signup failed"));
  }

  const data = await response.json();
  const { token, user } = data;

  if (!token || !user) throw new Error("Signup failed");

  // Store JWT token and user info in localStorage
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
};

// ------------------- LOGIN
export const login = async (credentials) => {
  let response;
  try {
    response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  } catch {
    throw new Error(
      `Cannot reach backend API at ${API_BASE_URL}. Ensure backend is running and CORS is enabled.`
    );
  }

  if (!response.ok) {
    throw new Error(
      await parseErrorResponse(response, "Invalid email or password")
    );
  }

  const data = await response.json();
  const { token, user } = data;

  if (!token || !user) throw new Error("Login failed");

  // Store JWT token and user info in localStorage
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return { token, user };
};

// ------------------- LOGOUT
export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// ------------------- GET STORED USER
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ------------------- AUTH CHECK
export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};
