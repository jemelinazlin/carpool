// src/context/Login.jsx or Login.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // adjust path if needed

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // Redirect back to where user came from, or home
  const from = location.state?.from?.pathname || "/";

  // ✅ Backend URL (use .env: VITE_API_URL)
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Helper: decode JWT safely
  const decodeJWT = (token) => {
    try {
      return JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
    } catch {
      return null;
    }
  };

  // ---------- Handle Google Login Redirect ----------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setLoadingGoogle(true);
      try {
        localStorage.setItem("token", token);

        const payload = decodeJWT(token);
        if (payload) {
          const user = { id: payload.id, email: payload.email };
          localStorage.setItem("user", JSON.stringify(user));
        }

        // Navigate after saving token
        setTimeout(() => navigate(from, { replace: true }), 50);
      } catch (err) {
        console.error("Error handling Google login token:", err);
        setError("Google login failed");
      } finally {
        setLoadingGoogle(false);
      }
    }
  }, [navigate, from]);

  // ---------- Handle Local Login ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 dark:bg-gray-800 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {loadingGoogle && <p className="text-teal-500 text-center">Processing Google login...</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold"
          disabled={loadingGoogle}
        >
          Login
        </button>

        {/* Google login */}
        <button
          type="button"
          onClick={() => (window.location.href = `${API_URL}/auth/google`)}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
          disabled={loadingGoogle}
        >
          Continue with Google
        </button>

        <p className="text-center text-gray-700 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link to="/register" className="text-teal-500 font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
