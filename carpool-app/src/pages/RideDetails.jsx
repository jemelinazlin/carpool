import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, User } from "lucide-react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function RideDetails({ ride: propRide }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Ride can come from props, location state, or fallback mock
  const rideFromState = location.state?.ride;
  const ride = propRide || rideFromState || {
    id: id || "N/A",
    from: "Nairobi",
    to: "Thika",
    time: "08:00 AM",
    seats: 3,
    driver: "John Doe",
  };

  const [seatsToBook, setSeatsToBook] = useState(1);
  const [booked, setBooked] = useState(false);

  // Reset booking if ride changes (useful if navigating between rides)
  useEffect(() => {
    setBooked(false);
    setSeatsToBook(1);
  }, [ride]);

  const handleBook = () => {
    if (seatsToBook > 0 && seatsToBook <= ride.seats) {
      setBooked(true);
    }
  };

  const handleSeatsChange = (e) => {
    const value = Math.max(1, Math.min(ride.seats, Number(e.target.value)));
    setSeatsToBook(value);
  };

  return (
    <motion.div
      className="bg-white shadow-2xl rounded-3xl max-w-xl w-full p-8 mx-auto flex flex-col gap-6 my-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">Ride Details</h2>

      <div className="flex flex-col gap-3 text-gray-700">
        <p className="flex items-center gap-2">
          <MapPin className="text-teal-500" /> From: <span className="font-semibold">{ride.from}</span>
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="text-indigo-500" /> To: <span className="font-semibold">{ride.to}</span>
        </p>
        <p className="flex items-center gap-2">
          <Clock className="text-yellow-500" /> Time: <span className="font-semibold">{ride.time}</span>
        </p>
        <p className="flex items-center gap-2">
          <Users className="text-pink-500" /> Seats Available: <span className="font-semibold">{ride.seats}</span>
        </p>
        <p className="flex items-center gap-2">
          <User className="text-gray-600" /> Driver: <span className="font-semibold">{ride.driver}</span>
        </p>
      </div>

      {!booked ? (
        <div className="flex flex-col gap-4">
          <input
            type="number"
            min="1"
            max={ride.seats}
            value={seatsToBook}
            onChange={handleSeatsChange}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 outline-none transition"
          />
          <button
            onClick={handleBook}
            disabled={seatsToBook < 1 || seatsToBook > ride.seats}
            className={`w-full p-3 rounded-xl font-bold shadow-md transition
              ${seatsToBook < 1 || seatsToBook > ride.seats
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600 text-white"
              }`}
          >
            Book {seatsToBook} {seatsToBook === 1 ? "Seat" : "Seats"}
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-teal-600 font-bold text-center mt-4 flex flex-col gap-2"
        >
          <p>✅ Successfully booked {seatsToBook} {seatsToBook === 1 ? "seat" : "seats"}!</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            Back to Rides
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
