import { useState, useEffect, useContext } from "react";
import axios from "axios";
import RideDetails from "./RideDetails";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OfferRide() {
  const { user, token, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [seats, setSeats] = useState(1);
  const [time, setTime] = useState("08:00");
  const [rides, setRides] = useState([]);
  const [success, setSuccess] = useState(false);

  const API_URL = "http://localhost:5000/rides";

  // Redirect to login only after AuthContext finishes loading
  useEffect(() => {
    if (!loading && (!user || !token)) {
      navigate("/login", { state: { from: "/offer" } });
    }
  }, [user, token, loading, navigate]);

  // Debug: log token and user
  useEffect(() => {
    console.log("User:", user);
    console.log("Token:", token);
  }, [user, token]);

  // Fetch existing rides
  useEffect(() => {
    if (!token) return; // wait for token
    axios
      .get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setRides(res.data))
      .catch((err) => console.error("Failed to fetch rides:", err));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You are not logged in. Cannot post ride.");
      return;
    }

    console.log("Posting ride with token:", token); // debug

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

      // Reset form
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

  if (loading) return <p>Loading...</p>; // Wait until AuthContext finishes

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Offer a Ride</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          placeholder="Pickup"
          className="w-full p-2 border rounded"
        />
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Destination"
          className="w-full p-2 border rounded"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          min="1"
          max="6"
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Post Ride
        </button>
      </form>

      {success && <p className="text-green-600 mt-2">Ride posted successfully!</p>}

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Posted Rides</h3>
        {rides.length > 0
          ? rides.map((ride) => <RideDetails key={ride.id} ride={ride} />)
          : <p>No rides yet.</p>}
      </div>
    </div>
  );
}
