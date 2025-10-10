// src/pages/EditProfile.jsx
import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { CheckCircle, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function EditProfile() {
  const { user, token, login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${user.id}`,
        { name, email, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      login(token, res.data); // Update context
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-sky-50 to-white flex items-center justify-center p-4">
      <motion.div
        className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex flex-col items-center mb-6">
          <User className="w-16 h-16 text-teal-500 mb-3" />
          <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
          <p className="text-gray-500 text-sm text-center">
            Update your account details below
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-gradient-to-r from-teal-500 to-sky-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:from-teal-600 hover:to-sky-600 transition-all duration-200"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {success && (
          <motion.div
            className="absolute top-4 right-4 flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-medium shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CheckCircle className="w-5 h-5" /> Profile updated!
          </motion.div>
        )}

        {/* Fun decorative animation */}
        <motion.div
          className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-r from-teal-200 to-sky-300 rounded-full opacity-30"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-r from-yellow-200 to-pink-300 rounded-full opacity-20"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}
