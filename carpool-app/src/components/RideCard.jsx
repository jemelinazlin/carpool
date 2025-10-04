import { useState } from "react";
import axios from "axios";

export default function RideCard({ ride, token, onBooked }) {
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [booked, setBooked] = useState(false);

  const handleBook = async () => {
    if (seatsToBook < 1 || seatsToBook > ride.seats) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/rides/${ride.id}/book`,
        { seats: seatsToBook },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooked(true);
      onBooked(ride.id, seatsToBook);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to book ride");
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-gray-800 shadow hover:shadow-lg flex flex-col gap-2">
      <p className="font-semibold">{ride.origin} → {ride.destination}</p>
      <p>Driver: {ride.driver}</p>
      <p>Time: {ride.time} | Seats: {ride.seats}</p>

      {!booked ? (
        <>
          <input
            type="number"
            min="1"
            max={ride.seats}
            value={seatsToBook}
            onChange={(e) => setSeatsToBook(Number(e.target.value))}
            className="p-2 border rounded w-full"
          />
          <button
            onClick={handleBook}
            className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600 mt-1"
          >
            Book {seatsToBook} {seatsToBook === 1 ? "Seat" : "Seats"}
          </button>
        </>
      ) : (
        <p className="text-green-600 font-bold text-center">✅ Booked!</p>
      )}
    </div>
  );
}
