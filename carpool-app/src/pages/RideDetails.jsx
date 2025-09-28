import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, User } from "lucide-react";
import { useParams, useLocation } from "react-router-dom";

export default function RideDetails({ ride: propRide }) {
  const params = useParams();
  const location = useLocation();

  // Ride can come from props, location state, or fallback mock
  const rideFromState = location.state?.ride;
  const ride = propRide || rideFromState || {
    from: "Nairobi",
    to: "Thika",
    time: "08:00 AM",
    seats: 3,
    driver: "John Doe",
  };

  const [seatsToBook, setSeatsToBook] = useState(1);
  const [booked, setBooked] = useState(false);

  const handleBook = () => setBooked(true);

  return (
    <motion.div
      className="bg-white shadow-2xl rounded-3xl max-w-xl w-full p-8 mx-auto flex flex-col gap-4 my-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">Ride Details</h2>

      <div className="flex flex-col gap-2 text-gray-700">
        <p className="flex items-center gap-2">
          <MapPin className="text-teal-500" /> From: {ride.from}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="text-indigo-500" /> To: {ride.to}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="text-yellow-500" /> Time: {ride.time}
        </p>
        <p className="flex items-center gap-2">
          <Users className="text-pink-500" /> Seats Available: {ride.seats}
        </p>
        <p className="flex items-center gap-2">
          <User className="text-gray-600" /> Driver: {ride.driver}
        </p>
      </div>

      {!booked ? (
        <>
          <input
            type="number"
            min="1"
            max={ride.seats}
            value={seatsToBook}
            onChange={(e) => setSeatsToBook(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 outline-none"
          />
          <button
            onClick={handleBook}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-xl font-bold shadow-md transition"
          >
            Book Ride
          </button>
        </>
      ) : (
        <p className="text-teal-600 font-bold text-center mt-4">
          ✅ Ride booked successfully!
        </p>
      )}
    </motion.div>
  );
}
