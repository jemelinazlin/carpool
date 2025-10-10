// src/pages/Register.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  // Backend API URL from .env
  const API_URL = import.meta.env.VITE_API_URL;

  const handleRegister = async (e) => {
    e.preventDefault();

    setError(""); // clear previous errors

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await register(name, email, phone, password);

      if (res.success) {
        navigate("/"); // redirect to home or dashboard
      } else {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleRegister}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Create Account
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
        />

        <button
          type="submit"
          className="w-full bg-[#00BFA6] hover:bg-[#009e87] text-white py-3 rounded-xl font-semibold transition"
        >
          Register
        </button>

        {/* Google login */}
        <button
          type="button"
          onClick={() => (window.location.href = `${API_URL}/auth/google`)}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
        >
          Continue with Google
        </button>

        <p className="text-center text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-[#00BFA6] font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
