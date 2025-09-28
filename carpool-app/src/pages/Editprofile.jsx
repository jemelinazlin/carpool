// src/pages/EditProfile.jsx
import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function EditProfile() {
  const { user, login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/users/${user.id}`,
        { name, email, phone },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      login(localStorage.getItem("token"), res.data); // update context
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <motion.div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-teal-400" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-teal-400" required />
          <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-teal-400" />
          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-xl font-bold shadow-md">Save</button>
        </form>
        {success && (
          <motion.div className="absolute top-4 right-4 flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-medium shadow-md" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <CheckCircle className="w-5 h-5" /> Profile updated!
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
