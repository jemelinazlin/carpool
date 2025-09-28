import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Clock, User } from "lucide-react";

export default function RideDetailsCard({ ride }) {
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [booked, setBooked] = useState(false);

  const handleBook = () => setBooked(true);

  return (
    <motion.div
      className="bg-white shadow-2xl rounded-3xl p-6 w-full md:w-3/4 lg:w-2/3 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Ride Details</h2>
      <div className="flex flex-col gap-2 text-gray-700">
        <p className="flex items-center gap-2"><MapPin className="text-teal-500" /> From: {ride.from}</p>
        <p className="flex items-center gap-2"><MapPin className="text-indigo-500" /> To: {ride.to}</p>
        <p className="flex items-center gap-2"><Clock className="text-yellow-500" /> Time: {ride.time}</p>
        <p className="flex items-center gap-2"><Users className="text-pink-500" /> Seats: {ride.seats}</p>
        <p className="flex items-center gap-2"><User className="text-gray-600" /> Driver: {ride.driver}</p>
      </div>

      {!booked ? (
        <>
          <input
            type="number"
            min="1"
            max={ride.seats}
            value={seatsToBook}
            onChange={(e) => setSeatsToBook(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-400 outline-none mt-4"
          />
          <button
            onClick={handleBook}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-xl font-bold shadow-md mt-4 transition"
          >
            Book Ride
          </button>
        </>
      ) : (
        <p className="text-teal-600 font-bold text-center mt-4">✅ Ride booked successfully!</p>
      )}
    </motion.div>
  );
}
