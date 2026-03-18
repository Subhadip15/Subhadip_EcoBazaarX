import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin }) => {
    if (!isAdmin) {
        // Redirect unauthorized users to the products page
        return <Navigate to="/products" replace />;
    }
    return children;
};