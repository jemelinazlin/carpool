// src/pages/ProfileDashboard.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { User, Edit2, Car, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export default function ProfileDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [ridesOffered, setRidesOffered] = useState(0);
  const [ridesBooked, setRidesBooked] = useState(0);

  useEffect(() => {
    if (!user || !token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);

        // Example: count rides offered/booked (adjust according to your backend)
        setRidesOffered(res.data.ridesOffered?.length || 0);
        setRidesBooked(res.data.ridesBooked?.length || 0);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 403) {
          alert("Access denied. Please log in again.");
          logout();
        }
      }
    };

    fetchProfile();
  }, [user, token, logout]);

  if (!user || !token) {
    return (
      <p className="text-center mt-20 text-gray-900 dark:text-white">
        Please login to view your profile
      </p>
    );
  }

  const { name, email, phone, createdAt } = profile || {};

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-200 px-4 md:px-12 pt-32 space-y-12">
      {/* Main Profile Card */}
      <motion.div
        className="flex flex-col md:flex-row items-center justify-between gap-6 w-full bg-white/90 dark:bg-gray-800/20 backdrop-blur-xl p-6 rounded-3xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full md:w-auto">
          <User className="w-20 h-20 text-teal-600 flex-shrink-0" />
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold">{name || "N/A"}</h1>
            <p className="text-gray-500 dark:text-gray-300 break-words">{email || "N/A"}</p>
            {phone && <p className="text-gray-500 dark:text-gray-300">Phone: {phone}</p>}
            <p className="text-gray-500 dark:text-gray-300">Joined: {createdAt ? createdAt.split("T")[0] : "N/A"}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link
            to="/edit-profile"
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-xl text-white font-semibold text-center flex items-center gap-2 justify-center"
          >
            <Edit2 className="w-5 h-5" /> Edit Profile
          </Link>
          <button
            onClick={logout}
            className="w-full sm:w-auto bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-white font-semibold"
          >
            Logout
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg flex flex-col items-center space-y-2 hover:shadow-2xl transition"
          whileHover={{ scale: 1.05 }}
        >
          <Car className="w-10 h-10 text-teal-500" />
          <p className="text-lg font-semibold">{ridesOffered}</p>
          <p className="text-gray-500 dark:text-gray-300 text-sm">Rides Offered</p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg flex flex-col items-center space-y-2 hover:shadow-2xl transition"
          whileHover={{ scale: 1.05 }}
        >
          <Calendar className="w-10 h-10 text-yellow-400" />
          <p className="text-lg font-semibold">{ridesBooked}</p>
          <p className="text-gray-500 dark:text-gray-300 text-sm">Rides Booked</p>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg flex flex-col items-center space-y-2 hover:shadow-2xl transition"
          whileHover={{ scale: 1.05 }}
        >
          <User className="w-10 h-10 text-sky-500" />
          <p className="text-lg font-semibold">{profile?.followers?.length || 0}</p>
          <p className="text-gray-500 dark:text-gray-300 text-sm">Followers</p>
        </motion.div>
      </motion.div>

      {/* Additional Info Section */}
      <motion.div
        className="bg-white/90 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl p-6 shadow-2xl space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold">Account Info</h2>
        <p className="text-gray-600 dark:text-gray-300">Full Name: {name || "N/A"}</p>
        <p className="text-gray-600 dark:text-gray-300">Email: {email || "N/A"}</p>
        <p className="text-gray-600 dark:text-gray-300">Phone: {phone || "N/A"}</p>
        <p className="text-gray-600 dark:text-gray-300">Joined: {createdAt ? createdAt.split("T")[0] : "N/A"}</p>
        <p className="text-gray-600 dark:text-gray-300">Account Status: Active</p>
      </motion.div>

      {/* Decorative CTA */}
      <motion.div
        className="mt-8 py-12 bg-gradient-to-r from-sky-100 via-teal-100 to-cyan-100 dark:from-gray-800 dark:to-gray-700 text-center rounded-3xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-2">Want to offer a ride?</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">Share your route and help others travel safely!</p>
        <Link
          to="/offer"
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          Offer a Ride 🚗
        </Link>
      </motion.div>
    </div>
  );
}
