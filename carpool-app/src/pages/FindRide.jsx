import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";

export default function FindRide() {
  const { user, token, loading } = useContext(AuthContext);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [searching, setSearching] = useState(false);
  const [rides, setRides] = useState([]);
  const [toast, setToast] = useState("");

  const API_URL = `${import.meta.env.VITE_API_URL}/rides`;

  if (loading) return <div className="text-center mt-6">Loading...</div>;
  if (!user || !token) return <Navigate to="/login" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickup || !destination) return alert("Please enter pickup and destination!");

    setSearching(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { origin: pickup, destination: destination, date: date || undefined },
      });
      setRides(Array.isArray(res.data) ? res.data : []);
      if (!res.data.length) setToast("No rides found 😢");
    } catch (err) {
      console.error(err);
      alert("Failed to fetch rides.");
    } finally {
      setSearching(false);
      setTimeout(() => setToast(""), 3000);
    }
  };

  const handleBooked = (rideId, seats = 1) => {
    setRides((prev) =>
      prev.map((r) => (r.id === rideId ? { ...r, seats: r.seats - seats } : r))
    );
    setToast(`✅ Successfully booked ${seats} ${seats === 1 ? "seat" : "seats"}!`);
    setTimeout(() => setToast(""), 3000);
  };

  // Dummy passengers waiting (with automatic images)
  const waitingPassengers = [
    { name: "Alice", from: "Nairobi", to: "Thika" },
    { name: "Bob", from: "Mombasa", to: "Nairobi" },
    { name: "Chloe", from: "Kisumu", to: "Nakuru" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-sky-50 to-white text-gray-900 px-4 py-8">

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
        className="text-center py-16 bg-gradient-to-r from-teal-400 via-cyan-300 to-sky-400 rounded-3xl shadow-lg mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-white drop-shadow-lg">
          Find Your Ride
        </h1>
        <p className="text-lg md:text-xl text-white/90">
          Search and book rides in Kenya 🚘
        </p>
      </motion.section>

      {/* Passengers Waiting */}
      <motion.div className="flex gap-4 overflow-x-auto py-4 mb-6">
        {waitingPassengers.map((p, i) => (
          <motion.div
            key={i}
            className="min-w-[180px] bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center text-center border border-gray-200"
            whileHover={{ scale: 1.1, rotate: [0, 3, -3, 0] }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
              alt="Passenger"
              className="w-20 h-20 object-contain mb-2"
            />
            <p className="font-semibold">{p.name}</p>
            <p className="text-gray-500 text-sm">{p.from} → {p.to}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Search Form */}
      <motion.div
        className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4 border border-gray-200 mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Pickup Location"
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Destination"
            className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <div className="flex items-center gap-3">
            <Calendar className="text-yellow-400 w-6 h-6" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="bg-gradient-to-r from-teal-500 to-sky-500 text-white p-3 rounded-xl font-semibold shadow-lg hover:from-teal-600 hover:to-sky-600 transition"
          >
            {searching ? "🔍 Searching..." : "Search Rides 🚀"}
          </button>
        </form>
      </motion.div>

      {/* Featured Rides Banner */}
      {rides.length > 0 && (
        <motion.div className="overflow-x-auto flex gap-4 py-4 mb-6">
          {rides.map((ride, i) => (
            <motion.div
              key={ride.id}
              className="min-w-[220px] bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center text-center border border-gray-200"
              whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
            >
              <img
                src={`https://source.unsplash.com/100x100/?cartoon,car&sig=${i}`}
                alt="Car"
                className="w-24 h-24 object-contain mb-2"
              />
              <p className="font-semibold">{ride.origin} → {ride.destination}</p>
              <p className="text-gray-500 text-sm">Time: {ride.time}</p>
              <p className="text-gray-500 text-sm">Seats: {ride.seats}</p>
              <button
                onClick={() => handleBooked(ride.id, 1)}
                className="mt-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg shadow transition"
              >
                Book 1 Seat
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Offer Ride CTA */}
      <motion.div
        className="mt-16 py-12 bg-gradient-to-r from-sky-100 via-teal-100 to-cyan-100 text-center rounded-t-3xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-3">Can't find your route?</h2>
        <p className="text-gray-700 mb-6">
          Offer a ride and connect with nearby passengers!
        </p>
        <Link
          to="/offer"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
        >
          Offer a Ride 🚗
        </Link>
      </motion.div>
    </div>
  );
}
