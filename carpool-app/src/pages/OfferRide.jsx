import { useState, useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function OfferRide() {
  const { user, token, loading } = useContext(AuthContext);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [seats, setSeats] = useState(1);
  const [time, setTime] = useState("08:00");
  const [rides, setRides] = useState([]);
  const [success, setSuccess] = useState(false);

  const API_URL = `${import.meta.env.VITE_API_URL}/rides`;

  // Fetch rides for logged-in user
  useEffect(() => {
    if (!token) return;

    axios
      .get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setRides(res.data))
      .catch((err) => console.error(err.response || err));
  }, [token]);

  // Submit new ride
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must log in first.");

    const rideData = {
      user_id: user.id, // matches backend column
      origin: pickup.trim() || "Nairobi",
      destination: destination.trim() || "Thika",
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
      console.error(err.response || err);
      alert(err.response?.data?.error || "Failed to post ride");
    }
  };

  // Show loading spinner
  if (loading) return <p className="text-center mt-6">Loading...</p>;

  // Redirect if not logged in
  if (!user || !token) return <Navigate to="/login" />;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">Offer a Ride</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder="Pickup"
          className="w-full p-3 border rounded-xl"
        />
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination"
          className="w-full p-3 border rounded-xl"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-3 border rounded-xl"
        />
        <input
          type="number"
          min="1"
          max="6"
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-full p-3 border rounded-xl"
        />
        <button
          type="submit"
          className="w-full bg-teal-500 text-white p-3 rounded-xl"
        >
          Post Ride
        </button>
      </form>

      {success && (
        <p className="text-green-600 text-center">Ride posted successfully!</p>
      )}

      <div className="space-y-4 mt-6">
        <h3 className="text-xl font-semibold">Your Rides</h3>
        {rides.length > 0 ? (
          rides.map((ride) => (
            <div key={ride.id} className="p-3 border rounded-xl bg-gray-50">
              {ride.origin} → {ride.destination} | Time: {ride.time} | Seats:{" "}
              {ride.seats}
            </div>
          ))
        ) : (
          <p>No rides yet.</p>
        )}
      </div>
    </div>
  );
}
