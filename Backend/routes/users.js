import express from "express";
import { getDB } from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Ensure JSON responses
router.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// ---------- Get user profile (protected) ----------
router.get("/:id", verifyToken, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });
  if (id !== req.user.id) return res.status(403).json({ error: "Access denied" });

  try {
    const user = await getDB().get("SELECT id, name, email, phone FROM users WHERE id = ?", [id]);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user", details: err.message });
  }
});

// ---------- Update user profile (protected) ----------
router.put("/:id", verifyToken, async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid user ID" });
  if (id !== req.user.id) return res.status(403).json({ error: "Access denied" });

  const { name, email, phone } = req.body;

  try {
    const db = getDB();
    const existingUser = await db.get("SELECT * FROM users WHERE id = ?", [id]);
    if (!existingUser) return res.status(404).json({ error: "User not found" });

    await db.run(
      "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
      [name || existingUser.name, email || existingUser.email, phone || existingUser.phone, id]
    );

    const updatedUser = await db.get("SELECT id, name, email, phone FROM users WHERE id = ?", [id]);
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user", details: err.message });
  }
});

export default router;
