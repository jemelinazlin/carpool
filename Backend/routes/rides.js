import express from "express";
import { getDB } from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ---------- Offer a Ride (protected) ----------
router.post("/", verifyToken, async (req, res) => {
  const { origin, destination, time, seats } = req.body;
  try {
    const result = await getDB().run(
      "INSERT INTO rides (driver_id, origin, destination, time, seats) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, origin, destination, time, seats]
    );
    res.json({ id: result.lastID, message: "Ride created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create ride", details: err.message });
  }
});

// ---------- Find Rides ----------
router.get("/", async (req, res) => {
  const { origin, destination, date } = req.query;

  let query = `
    SELECT r.id, u.name AS driver, r.origin, r.destination, r.time, r.seats
    FROM rides r
    JOIN users u ON r.driver_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (origin) {
    query += " AND r.origin LIKE ?";
    params.push(`%${origin}%`);
  }
  if (destination) {
    query += " AND r.destination LIKE ?";
    params.push(`%${destination}%`);
  }
  if (date) {
    query += " AND DATE(r.time) = DATE(?)";
    params.push(date);
  }

  try {
    const rides = await getDB().all(query, params);
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rides", details: err.message });
  }
});

// ---------- Book a Ride (protected) ----------
router.post("/:id/book", verifyToken, async (req, res) => {
  const rideId = req.params.id;
  const seatsToBook = Number(req.body.seats);

  if (!seatsToBook || seatsToBook < 1) {
    return res.status(400).json({ error: "Invalid number of seats" });
  }

  try {
    const db = getDB();

    // Get the ride
    const ride = await db.get("SELECT * FROM rides WHERE id = ?", [rideId]);
    if (!ride) return res.status(404).json({ error: "Ride not found" });
    if (seatsToBook > ride.seats) return res.status(400).json({ error: "Not enough seats available" });

    // Update remaining seats
    await db.run("UPDATE rides SET seats = seats - ? WHERE id = ?", [seatsToBook, rideId]);

    // Optionally, record booking in a separate table (if you create one)
    // await db.run("INSERT INTO bookings (ride_id, user_id, seats) VALUES (?, ?, ?)", [rideId, req.user.id, seatsToBook]);

    res.json({ message: "Ride booked successfully", rideId, seatsBooked: seatsToBook });
  } catch (err) {
    res.status(500).json({ error: "Failed to book ride", details: err.message });
  }
});

export default router;
