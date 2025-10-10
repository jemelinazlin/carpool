// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Backend URL from .env
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ---------- Load user/token from localStorage ----------
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ---------- Local Login ----------
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const loginToken = res.data.token;
      const loginUser = res.data.user;

      setToken(loginToken);
      setUser(loginUser);
      localStorage.setItem("token", loginToken);
      localStorage.setItem("user", JSON.stringify(loginUser));

      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Login failed" };
    }
  };

  // ---------- Local Register ----------
  const register = async (name, email, phone, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, phone, password });
      const newToken = res.data.token;
      const newUser = res.data.user;

      setToken(newToken);
      setUser(newUser);
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));

      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Registration failed" };
    }
  };

  // ---------- Google Login ----------
  const loginWithGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  // ---------- Logout ----------
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
