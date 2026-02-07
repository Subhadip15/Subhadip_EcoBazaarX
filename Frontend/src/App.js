// import logo from './logo.svg';
// import './App.css';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Home from './Home';
// import Login from './Login';
// import Register from './Register';

// function App() {
//   return (
//     <BrowserRouter>
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<Login />} />
//       <Route path = "/register" element={<Register/>}/>
//     </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import { isAuthenticated, getStoredUser } from "./services/authService";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    if (isAuthenticated()) {
      const storedUser = getStoredUser();
      setUser(storedUser);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setPage("login");
  };

  // If user is authenticated, show dashboard
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  // Otherwise show login or signup
  return (
    <>
      {page === "login" ? (
        <Login 
          goToSignup={() => setPage("signup")} 
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Signup 
          goToLogin={() => setPage("login")} 
          onSignupSuccess={handleSignupSuccess}
        />
      )}
    </>
  );
}

export default App;
