import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { Car, Calendar, MapPin } from "lucide-react";

export default function FindRide() {
  const { user, token, loading } = useContext(AuthContext);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [rides, setRides] = useState([]);
  const [searching, setSearching] = useState(false);
  const [toast, setToast] = useState("");

  const API_URL = `${import.meta.env.VITE_API_URL}/rides`;

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!user || !token) return <Navigate to="/login" />;

  // Fetch rides from backend
  const fetchRides = async () => {
    setSearching(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          origin: pickup.trim() || undefined,
          destination: destination.trim() || undefined,
          date: date || undefined,
        },
      });
      setRides(Array.isArray(res.data) ? res.data : []);
      if (!res.data.length) setToast("No rides found 😢");
    } catch (err) {
      console.error(err.response || err);
      alert("Failed to fetch rides");
    } finally {
      setSearching(false);
      setTimeout(() => setToast(""), 3000);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!pickup && !destination) return alert("Enter pickup or destination!");
    fetchRides();
  };

  const handleBook = (rideId) => {
    setRides((prev) =>
      prev.map((r) => (r.id === rideId ? { ...r, seats: r.seats - 1 } : r))
    );
    setToast("✅ Seat booked successfully!");
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-200 px-4 py-8 overflow-x-hidden">

      {/* Toast */}
      {toast && (
        <motion.div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {toast}
        </motion.div>
      )}

      {/* Hero */}
      <motion.section
        className="relative w-full py-16 md:py-24 text-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Find Your Perfect Ride
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl font-light max-w-2xl mx-auto"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Search, compare, and book rides safely 🚘
        </motion.p>

        {/* Decorative Car Icons */}
        <motion.div
          className="absolute top-10 left-10 text-teal-300 opacity-20 rotate-[20deg]"
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Car size={80} />
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10 text-sky-300 opacity-20 -rotate-[15deg]"
          animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Car size={100} />
        </motion.div>
      </motion.section>

      {/* Search Form */}
      <motion.form
        onSubmit={handleSearch}
        className="max-w-xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 flex flex-col space-y-4 border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-2">
          <MapPin className="text-teal-500 w-6 h-6" />
          <input
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Pickup Location"
            className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 outline-none dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="text-sky-500 w-6 h-6" />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination"
            className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 outline-none dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="text-yellow-400 w-6 h-6" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 outline-none dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={searching}
          className="w-full bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white p-3 rounded-xl font-semibold shadow-lg"
        >
          {searching ? "🔍 Searching..." : "Search Rides 🚀"}
        </motion.button>
      </motion.form>

      {/* Rides Grid */}
      <motion.div
        className="max-w-6xl mx-auto mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {Array.isArray(rides) && rides.length > 0 ? (
          rides.map((ride, index) => (
            <motion.div
              key={ride.id}
              className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={`https://source.unsplash.com/600x400/?car,${encodeURIComponent(
                  ride.origin
                )}&sig=${index}`}
                alt={`${ride.origin} → ${ride.destination}`}
                className="w-full h-52 sm:h-56 md:h-48 lg:h-52 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-white">
                <p className="font-semibold text-lg">
                  {ride.origin} → {ride.destination}
                </p>
                <p className="text-sm">
                  Time: {ride.time} | Seats: {ride.seats}
                </p>
                <button
                  onClick={() => handleBook(ride.id)}
                  className="mt-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg shadow"
                >
                  Book 1 Seat
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          !searching && (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400 font-medium mt-6">
              No rides found.
            </p>
          )
        )}
      </motion.div>
    </div>
  );
}
