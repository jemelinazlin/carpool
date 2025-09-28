import express from "express";
import { getDB } from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get user profile by ID (protected)
router.get("/:id", verifyToken, async (req, res) => {
  if (parseInt(req.params.id) !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }
  const user = await getDB().get("SELECT id, name, email, phone FROM users WHERE id = ?", [
    req.params.id,
  ]);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// Update user profile (protected)
router.put("/:id", verifyToken, async (req, res) => {
  if (parseInt(req.params.id) !== req.user.id) {
    return res.status(403).json({ error: "Access denied" });
  }

  const { name, email, phone } = req.body;
  try {
    await getDB().run(
      "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
      [name, email, phone, req.params.id]
    );
    const updatedUser = await getDB().get(
      "SELECT id, name, email, phone FROM users WHERE id = ?",
      [req.params.id]
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user", details: err.message });
  }
});

export default router;
