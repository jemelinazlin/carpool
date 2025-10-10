import express from "express";
import { getDB } from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ---------- GET all rides ----------
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const rides = await db.all("SELECT * FROM rides ORDER BY id DESC");
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
    const db = getDB();
    const result = await db.run(
      `INSERT INTO rides (user_id, origin, destination, time, seats)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, origin, destination, time, seats]
    );

    const ride = await db.get("SELECT * FROM rides WHERE id = ?", [result.lastID]);
    res.status(201).json(ride);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create ride", details: err.message });
  }
});

export default router;
