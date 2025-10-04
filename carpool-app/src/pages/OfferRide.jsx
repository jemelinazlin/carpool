import { useState, useEffect, useContext } from "react";
import axios from "axios";
import RideDetails from "./RideDetails";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function OfferRide() {
  const { user, token, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [seats, setSeats] = useState(1);
  const [time, setTime] = useState("08:00");
  const [rides, setRides] = useState([]);
  const [success, setSuccess] = useState(false);

  // ✅ Use environment variable for API
  const API_URL = `${import.meta.env.VITE_API_URL}/rides`;

  useEffect(() => {
    if (!token) return;
    axios
      .get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setRides(res.data))
      .catch((err) => console.error("Failed to fetch rides:", err));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must log in first to post a ride.");

    const rideData = {
      origin: pickup || "Nairobi",
      destination: destination || "Thika",
      time,
      seats: Number(seats),
    };

    try {
      const res = await axios.post(API_URL, rideData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides((prev) => [res.data, ...prev]);
      setSuccess(true);
      setPickup("");
      setDestination("");
      setSeats(1);
      setTime("08:00");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to post ride:", err.response || err);
      alert(err.response?.data?.error || "Failed to post ride");
    }
  };

  if (loading)
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-6 text-gray-900 dark:text-gray-200"
      >
        Loading...
      </motion.p>
    );

  if (!user || !token)
    return (
      <motion.div
        className="p-6 w-full max-w-md mx-auto text-center bg-white dark:bg-gray-800 rounded-xl shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-200">
          You need an account
        </h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Login, create a new account, or continue with Google:
        </p>
        <div className="space-y-3">
          <Link
            to="/login"
            className="block w-full bg-blue-500 dark:bg-blue-600 text-white p-2 rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block w-full bg-green-500 dark:bg-green-600 text-white p-2 rounded hover:bg-green-600 dark:hover:bg-green-700 transition"
          >
            Register
          </Link>
          {/* ✅ Google login now uses backend from env variable */}
          <button
            onClick={() =>
              (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)
            }
            className="block w-full bg-red-500 dark:bg-red-600 text-white p-2 rounded hover:bg-red-600 dark:hover:bg-red-700 transition"
          >
            Continue with Google
          </button>
        </div>
      </motion.div>
    );

  return (
    <motion.div
      className="p-4 md:p-6 w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 text-center">
        Offer a Ride
      </h2>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <input
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder="Pickup"
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition box-border"
        />
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination"
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition box-border"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition box-border"
        />
        <input
          type="number"
          min="1"
          max="6"
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition box-border"
        />
        <motion.button
          type="submit"
          className="w-full bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white p-3 rounded-xl font-semibold transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Post Ride
        </motion.button>
      </motion.form>

      {success && (
        <motion.p
          className="text-green-600 dark:text-green-400 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Ride posted successfully!
        </motion.p>
      )}

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
          Your Posted Rides
        </h3>
        {rides.length > 0 ? (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {rides.map((ride) => (
              <RideDetails key={ride.id} ride={ride} />
            ))}
          </motion.div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">No rides yet.</p>
        )}
      </div>
    </motion.div>
  );
}
