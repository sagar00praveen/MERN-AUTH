import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AppContextProvider } from "./context/AppContext.jsx";
import axios from "axios";

// ✅ Base URL of your Render backend
axios.defaults.baseURL = "https://mern-auth-wypp.onrender.com"; 
axios.defaults.withCredentials = true; // ✅ allow cookies to be sent

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>
);
