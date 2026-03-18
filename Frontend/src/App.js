import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ProductCatalog from "./pages/ProductCatalog";
import AddProduct from "./pages/AddProduct";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import WishlistPage from "./pages/WishlistPage";
import CarbonInsights from "./pages/CarbonInsights";
import AdminManagement from "./pages/AdminManagement";
import Footer from "./components/Footer";

import { isAuthenticated, getStoredUser, logout } from "./services/authService";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { WishlistProvider } from "./context/WishlistContext";

// Helper component for Protected Routes
const ProtectedRoute = ({ user, children, adminOnly = false }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const storedUser = getStoredUser();
        setUser(storedUser);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => setUser(userData);
  const handleSignupSuccess = (userData) => setUser(userData);
  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (loading) return <div className="loader">Initializing app...</div>;

  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Routes>
            {/* --- Public Routes --- */}
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/dashboard" replace /> : <Signup onSignupSuccess={handleSignupSuccess} />}
            />
            <Route
              path="/forgot-password"
              element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
            />

            {/* --- General Protected Routes --- */}
            <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard user={user} onLogout={handleLogout} /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute user={user}><ProductCatalog user={user} /></ProtectedRoute>} />
            <Route path="/products/:id" element={<ProtectedRoute user={user}><ProductDetail /></ProtectedRoute>} />

            {/* --- Admin Product Management --- */}
            <Route path="/add-product" element={<ProtectedRoute user={user} adminOnly={true}><AddProduct /></ProtectedRoute>} />
            <Route path="/edit-product/:id" element={<ProtectedRoute user={user} adminOnly={true}><AddProduct /></ProtectedRoute>} />

            {/* --- User Shopping & Checkout Flow --- */}
            <Route path="/cart" element={<ProtectedRoute user={user}><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute user={user}><CheckoutPage /></ProtectedRoute>} />
            
            {/* ✅ REAL PAYMENT PAGE (Card/UPI) */}
            <Route path="/payment-process" element={<ProtectedRoute user={user}><PaymentPage /></ProtectedRoute>} />
            
            {/* ✅ ORDER SUCCESS (After COD or Payment) */}
            <Route path="/order-success" element={<ProtectedRoute user={user}><OrderSuccess /></ProtectedRoute>} />
            
            <Route path="/my-orders" element={<ProtectedRoute user={user}><MyOrders /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute user={user}><WishlistPage /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute user={user}><CarbonInsights user={user} /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute user={user} adminOnly={true}><AdminManagement user={user} /></ProtectedRoute>} />

            {/* --- Default Redirect --- */}
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
            </Routes>
            <Footer user={user} />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
