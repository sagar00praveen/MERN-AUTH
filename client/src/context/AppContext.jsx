import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  // ---------------------------
  // Get logged-in user data
  // ---------------------------
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message || "Failed to get user data");
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || "Failed to fetch user data");
      }
    }
  };

  // ---------------------------
  // Check authentication state
  // ---------------------------
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || "Auth check failed");
      }
      setIsLoggedin(false);
    }
  };

  // ---------------------------
  // Run once on mount
  // ---------------------------
  useEffect(() => {
    // Ensure axios sends cookies for all requests
    axios.defaults.withCredentials = true;
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
