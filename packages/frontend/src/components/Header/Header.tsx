import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "../../contexts/AuthContext";

import axios from "axios";

const Header = () => {
  const { user, login } = useAuth(); // Assuming useAuth provides user state and a method to update it

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/user/profile", {
        withCredentials: true,
      });


      if (response.status === 200) {
        if (
          response.headers["content-type"].includes("application/json")

        ) {
          const userData = response.data;
          login(userData);
        } else {
          return;
        }
      } else if (response.status === 401) {
        return;
      } else {
        console.error(
          "Failed to fetch user data:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUserData(); // Fetch user data on component mount if not logged in
    }
  }, [user]);

  const handleLogin = () => {
    window.location.href = "http://localhost:3001/auth/google"; // Redirect to Google Auth
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
      {user?.role === "admin" && <Link to="/admin">Admin</Link>}
    </div>
  );
};

export default Header;
