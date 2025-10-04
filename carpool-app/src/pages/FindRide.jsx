import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import axios from "axios";
import RideCard from "../components/RideCard";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function FindRide() {
  const { user, token, loading } = useContext(AuthContext);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [searching, setSearching] = useState(false);
  const [rides, setRides] = useState([]);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [toast, setToast] = useState("");

  const API_URL = `${import.meta.env.VITE_API_URL}/rides`;

  // ---------- Loading / Auth ----------
  if (loading) return <div className="text-center mt-6">Loading...</div>;
  if (!user || !token) return <Navigate to="/login" replace />;

  // ---------- Fetch Suggestions ----------
  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query || query.length < 3) return setSuggestions([]);
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: query, format: "json", addressdetails: 1, limit: 5 },
      });
      setSuggestions(res.data);
    } catch {
      setSuggestions([]);
    }
  };

  useEffect(() => { if (pickup) fetchSuggestions(pickup, setPickupSuggestions); }, [pickup]);
  useEffect(() => { if (destination) fetchSuggestions(destination, setDestinationSuggestions); }, [destination]);

  // ---------- Fetch Rides ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearching(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          origin: pickup || undefined,
          destination: destination || undefined,
          date: date || undefined,
        },
      });
      setRides(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch rides.");
    } finally {
      setSearching(false);
    }
  };

  // ---------- Handle Booking Toast ----------
  const handleBooked = (rideId, seats) => {
    setRides(prev => prev.map(r => r.id === rideId ? { ...r, seats: r.seats - seats } : r));
    setToast(`✅ Successfully booked ${seats} ${seats === 1 ? "seat" : "seats"}!`);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-200 p-4 md:p-8">
      
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
      <motion.div
        className="w-full bg-teal-500 dark:bg-teal-700 text-white py-16 px-4 text-center rounded-b-3xl shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Find Your Ride 🚌</h1>
        <p className="text-md md:text-lg max-w-xl mx-auto">
          Search for rides going your way and book a seat instantly!
        </p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        className="relative -mt-12 w-full max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.form className="space-y-5" onSubmit={handleSubmit}>
          
          {/* Pickup */}
          <div className="flex flex-col relative">
            <div className="flex items-center space-x-3">
              <MapPin className="text-teal-500 w-6 h-6" />
              <input
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="From (Pickup)"
                className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 outline-none shadow-sm dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            {pickupSuggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full max-h-40 overflow-y-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 shadow-lg z-50">
                {pickupSuggestions.map((s) => (
                  <div
                    key={s.place_id}
                    onClick={() => { setPickup(s.display_name); setPickupSuggestions([]); }}
                    className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="flex flex-col relative">
            <div className="flex items-center space-x-3">
              <MapPin className="text-indigo-500 w-6 h-6" />
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="To (Destination)"
                className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 outline-none shadow-sm dark:bg-gray-700 dark:text-gray-200"
              />
            </div>
            {destinationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full max-h-40 overflow-y-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 shadow-lg z-50">
                {destinationSuggestions.map((s) => (
                  <div
                    key={s.place_id}
                    onClick={() => { setDestination(s.display_name); setDestinationSuggestions([]); }}
                    className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {s.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center space-x-3">
            <Calendar className="text-yellow-400 w-6 h-6" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-300 outline-none shadow-sm dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={searching}
            className="w-full bg-teal-500 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-700 text-white p-3 rounded-xl font-semibold shadow-md transition"
          >
            {searching ? "🔍 Searching..." : "Search Rides 🚀"}
          </motion.button>
        </motion.form>
      </motion.div>

      {/* Rides Grid */}
      <motion.div
        className="w-full max-w-2xl mx-auto mt-12 px-2 grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {rides.length > 0 ? (
          rides.map((ride) => (
            <RideCard key={ride.id} ride={ride} token={token} onBooked={handleBooked} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400 font-medium mt-6">
            {searching ? "" : "No rides found"}
          </p>
        )}
      </motion.div>
    </div>
  );
}
