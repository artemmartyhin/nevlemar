import React, { useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3001/user/profile", {
        credentials: "include",
      });
      if (response.ok) {
        const userData = await response.json();
        login(userData);
      } else if (response.status === 401) {
        // User is not authenticated, you can redirect or show a login button
      } else {
        console.error("Failed to fetch user data", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  }, [login]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userData = queryParams.get('user');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        login(parsedUserData);
        // Remove the 'user' query parameter from the URL
        navigate(location.pathname, { replace: true });
      } catch (error) {
        console.error('Failed to parse user data', error);
      }
    } else {
      fetchUserData();
    }
  }, [fetchUserData, location.search, login, navigate, location.pathname]);

  const handleLogin = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };


  return (
    <div className={styles.header}>
      <Link to="/">Home</Link>
      <Link to="/males">Males</Link>
      <Link to="/females">Females</Link>
      <Link to="/puppies">Puppies</Link>
      {user ? (
        <div>
          <span>Welcome, {user.firstName}! </span>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
};

export default Header;
