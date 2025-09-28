import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import axios from "axios";
import RideDetails from "./RideDetails";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function FindRide() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [searching, setSearching] = useState(false);
  const [rides, setRides] = useState([]);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const API_URL = "http://localhost:5000/rides";

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/find" } });
    }
  }, [user, navigate]);

  // Do not render the page until user is available
  if (!user) return null;

  // Fetch location suggestions from OpenStreetMap
  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query || query.length < 3) return setSuggestions([]);
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: query, format: "json", addressdetails: 1, limit: 5 },
      });
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    }
  };

  useEffect(() => { if (pickup) fetchSuggestions(pickup, setPickupSuggestions); }, [pickup]);
  useEffect(() => { if (destination) fetchSuggestions(destination, setDestinationSuggestions); }, [destination]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSearching(true);
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(API_URL, {
        params: { origin: pickup, destination: destination, date },
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch rides. Are you logged in?");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-16 px-4 md:px-0">
      <motion.h2
        className="text-4xl font-extrabold text-teal-600 mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🚌 Find a Ride
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col relative">
          <div className="flex items-center space-x-3">
            <MapPin className="text-teal-500 w-6 h-6" />
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="From (Pickup)"
              className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none shadow-sm"
            />
          </div>
          {pickupSuggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-50">
              {pickupSuggestions.map((s) => (
                <div
                  key={s.place_id}
                  onClick={() => { setPickup(s.display_name); setPickupSuggestions([]); }}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {s.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col relative">
          <div className="flex items-center space-x-3">
            <MapPin className="text-indigo-500 w-6 h-6" />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="To (Destination)"
              className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
            />
          </div>
          {destinationSuggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-50">
              {destinationSuggestions.map((s) => (
                <div
                  key={s.place_id}
                  onClick={() => { setDestination(s.display_name); setDestinationSuggestions([]); }}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {s.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="text-yellow-400 w-6 h-6" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400 outline-none shadow-sm"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={searching}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-xl font-semibold shadow-md transition"
        >
          {searching ? "🔍 Searching..." : "Search Rides 🚀"}
        </motion.button>
      </motion.form>

      {rides.length > 0 ? rides.map((ride) => <RideDetails key={ride.id} ride={ride} />) : (
        <p className="mt-6 text-gray-500 font-medium">{searching ? "" : "No rides found"}</p>
      )}
    </div>
  );
}
