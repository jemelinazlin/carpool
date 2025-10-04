import { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext"; // adjust path if needed

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect back to where user came from, or home
  const from = location.state?.from?.pathname || "/";

  // ✅ Check if redirected from Google with ?token=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      try {
        // Save token in localStorage
        localStorage.setItem("token", token);

        // Optionally decode token payload
        const payload = JSON.parse(atob(token.split(".")[1]));
        const user = { id: payload.id, email: payload.email };

        localStorage.setItem("user", JSON.stringify(user));

        // Redirect to previous page
        navigate(from, { replace: true });
      } catch (err) {
        console.error("Error handling Google login token:", err);
        setError("Google login failed");
      }
    }
  }, [navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold"
        >
          Login
        </button>

        {/* Google login */}
        <button
          type="button"
          onClick={() =>
            (window.location.href = "http://localhost:5000/auth/google")
          }
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
        >
          Continue with Google
        </button>

        <p className="text-center text-gray-300">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#00BFA6] font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
