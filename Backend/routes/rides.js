// routes/rides.js
import express from "express";
import { getDB } from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ---------- GET all rides ----------
router.get("/", async (req, res) => {
  try {
    const rides = await getDB().all(
      "SELECT r.*, u.name as driver_name, u.email as driver_email FROM rides r JOIN users u ON r.user_id = u.id ORDER BY r.id DESC"
    );
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rides", details: err.message });
  }
});

// ---------- POST new ride (protected) ----------
router.post("/", verifyToken, async (req, res) => {
  const { origin, destination, time, seats } = req.body;
  const userId = req.user.id;

  if (!origin || !destination || !time || !seats) {
    return res.status(400).json({ error: "Missing ride information" });
  }

  try {
    const result = await getDB().run(
      `INSERT INTO rides (user_id, origin, destination, time, seats)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, origin, destination, time, seats]
    );

    const ride = await getDB().get("SELECT * FROM rides WHERE id = ?", [result.lastID]);
    res.status(201).json(ride);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create ride", details: err.message });
  }
});

// ---------- POST /rides/:id/book ----------
router.post("/:id/book", verifyToken, async (req, res) => {
  const rideId = parseInt(req.params.id);
  const userId = req.user.id;

  if (isNaN(rideId)) return res.status(400).json({ error: "Invalid ride ID" });

  try {
    const db = getDB();

    // Check ride exists
    const ride = await db.get("SELECT * FROM rides WHERE id = ?", [rideId]);
    if (!ride) return res.status(404).json({ error: "Ride not found" });

    // Check seats available
    if (ride.seats < 1) return res.status(400).json({ error: "No seats available" });

    // Decrement seats
    await db.run("UPDATE rides SET seats = seats - 1 WHERE id = ?", [rideId]);

    // Record booking
    await db.run("INSERT INTO bookings (ride_id, user_id) VALUES (?, ?)", [rideId, userId]);

    res.json({ message: "Ride booked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to book ride", details: err.message });
  }
});

// ---------- GET bookings for a user ----------
router.get("/bookings/me", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const bookings = await getDB().all(
      `SELECT b.id as booking_id, r.origin, r.destination, r.time, r.seats, u.name as driver_name
       FROM bookings b
       JOIN rides r ON b.ride_id = r.id
       JOIN users u ON r.user_id = u.id
       WHERE b.user_id = ?
       ORDER BY b.id DESC`,
      [userId]
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings", details: err.message });
  }
});

export default router;
