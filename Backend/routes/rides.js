import express from "express";
import { getDB } from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Offer a Ride (protected)
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

// Find Rides
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

export default router;
