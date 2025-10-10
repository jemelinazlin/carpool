import { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import axios from "axios";
import RideCard from "../components/RideCard";
import { AuthContext } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function FindRide() {
  const { user, token, loading } = useContext(AuthContext);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [date, setDate] = useState("");
  const [searching, setSearching] = useState(false);
  const [rides, setRides] = useState([]);
  const [toast, setToast] = useState("");

  const mapRef = useRef();
  const API_URL = `${import.meta.env.VITE_API_URL}/rides`;

  if (loading) return <div className="text-center mt-6">Loading...</div>;
  if (!user || !token) return <Navigate to="/login" replace />;

  // ---------- Initialize Kenya location search ----------
  useEffect(() => {
    if (!mapRef.current) return;

    const provider = new OpenStreetMapProvider({
      params: { countrycodes: "ke", limit: 5 },
    });

    const pickupControl = new GeoSearchControl({
      provider,
      style: "bar",
      searchLabel: "Pickup Location",
      showMarker: false,
      retainZoomLevel: false,
    });

    const destinationControl = new GeoSearchControl({
      provider,
      style: "bar",
      searchLabel: "Destination Location",
      showMarker: false,
      retainZoomLevel: false,
    });

    const map = mapRef.current;

    // Add Pickup search
    L.control({ position: "topright" })
      .onAdd = () => {
        map.addControl(pickupControl);
      };

    // Add Destination search
    L.control({ position: "topright" })
      .onAdd = () => {
        map.addControl(destinationControl);
      };

    // Listen for pickup selection
    map.on("geosearch/showlocation", (e) => {
      const { x, y, label } = e.location;
      if (!pickupCoords) {
        setPickupCoords([y, x]);
        setPickup(label);
      } else {
        setDestinationCoords([y, x]);
        setDestination(label);
      }
    });
  }, [mapRef]);

  // ---------- Fetch Rides ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickup || !destination) return alert("Please select pickup and destination!");
    setSearching(true);
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          origin: pickup,
          destination: destination,
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

  // ---------- Booking Toast ----------
  const handleBooked = (rideId, seats) => {
    setRides(prev =>
      prev.map(r => (r.id === rideId ? { ...r, seats: r.seats - seats } : r))
    );
    setToast(`✅ Successfully booked ${seats} ${seats === 1 ? "seat" : "seats"}!`);
    setTimeout(() => setToast(""), 3000);
  };

  const bounds =
    pickupCoords && destinationCoords
      ? [pickupCoords, destinationCoords]
      : pickupCoords
      ? [pickupCoords]
      : destinationCoords
      ? [destinationCoords]
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-200 overflow-x-hidden">

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
        className="relative w-full py-20 bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-500 text-white text-center shadow-xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.h1 className="text-5xl md:text-6xl font-extrabold mb-3 drop-shadow-lg">
          Find Your Perfect Ride
        </motion.h1>
        <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
          Search, compare, and book rides in Kenya 🚘
        </p>
      </motion.section>

      {/* Map Preview */}
      {(pickupCoords || destinationCoords) && (
        <motion.div
          className="w-full max-w-4xl mx-auto mt-8 rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <MapContainer
            ref={mapRef}
            center={pickupCoords || destinationCoords || [-1.286389, 36.817223]}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
            scrollWheelZoom={false}
            bounds={bounds}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {pickupCoords && <Marker position={pickupCoords} />}
            {destinationCoords && <Marker position={destinationCoords} />}
            {pickupCoords && destinationCoords && (
              <Polyline positions={[pickupCoords, destinationCoords]} color="teal" />
            )}
          </MapContainer>
        </motion.div>
      )}

      {/* Search Form */}
      <motion.div
        className="relative mt-8 w-full max-w-2xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <input
              value={pickup}
              placeholder="Pickup Location (Kenya)"
              readOnly
              className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 outline-none dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="flex flex-col">
            <input
              value={destination}
              placeholder="Destination Location (Kenya)"
              readOnly
              className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 outline-none dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="text-yellow-400 w-6 h-6" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none dark:bg-gray-700 dark:text-gray-200"
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
        </form>
      </motion.div>

      {/* Rides Grid */}
      <motion.div
        className="w-full max-w-5xl mx-auto mt-10 px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {rides.length > 0 ? (
          rides.map((ride) => (
            <RideCard key={ride.id} ride={ride} token={token} onBooked={handleBooked} />
          ))
        ) : (
          !searching && (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400 font-medium mt-6">
              No rides found — try adjusting your search.
            </p>
          )
        )}
      </motion.div>

      {/* Offer Ride CTA */}
      <motion.div
        className="mt-20 py-16 bg-gradient-to-r from-sky-100 via-teal-100 to-cyan-100 dark:from-gray-800 dark:to-gray-700 text-center rounded-t-3xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-3">Can’t find your route?</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">Offer a ride and connect with nearby passengers!</p>
        <Link
          to="/offer-ride"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          Offer a Ride 🚗
        </Link>
      </motion.div>
    </div>
  );
}
