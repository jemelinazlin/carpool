// AuthContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // 🔹 Login
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", { email, password });
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

  // 🔹 Register
  const register = async (name, email, phone, password) => {
    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        name,
        email,
        phone,
        password,
      });

      // Option A: Auto-login after register
      const newToken = res.data.token;
      const newUser = res.data.user;

      if (newToken && newUser) {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Registration failed" };
    }
  };

  // 🔹 Google Login (placeholder, needs backend support)
  const loginWithGoogle = () => {
    window.location.href = "http://localhost:5000/auth/google"; 
    // this should redirect to your backend Google OAuth flow
  };

  // 🔹 Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
