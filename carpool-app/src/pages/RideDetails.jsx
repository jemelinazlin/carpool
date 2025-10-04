import { useState } from "react";
import axios from "axios";

export default function RideDetails({ ride }) {
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [booked, setBooked] = useState(false);

  const token = localStorage.getItem("token");
  const API_URL = `${import.meta.env.VITE_API_URL}/rides`;

  const handleBook = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/${ride.id}/book`,
        { seats: seatsToBook },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBooked(true);
      alert(`Successfully booked ${seatsToBook} seat(s)!`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to book ride");
    }
  };

  return (
    <div className="space-y-2">
      <p><strong>From:</strong> {ride.from}</p>
      <p><strong>To:</strong> {ride.to}</p>
      <p><strong>Time:</strong> {ride.time}</p>
      <p><strong>Seats Available:</strong> {ride.seats}</p>
      <p><strong>Driver:</strong> {ride.driver}</p>

      {!booked ? (
        <>
          <input
            type="number"
            min="1"
            max={ride.seats}
            value={seatsToBook}
            onChange={(e) => setSeatsToBook(Math.min(ride.seats, Number(e.target.value)))}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleBook}
            className="mt-2 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            Book Ride
          </button>
        </>
      ) : (
        <p className="mt-2 text-green-600 font-bold">✅ Ride booked!</p>
      )}
    </div>
  );
}
