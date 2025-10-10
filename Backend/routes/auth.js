import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { getDB } from "../db.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ---------- CONFIG ----------
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4173";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const GOOGLE_CALLBACK_URL = `${BACKEND_URL}/auth/google/callback`;

// ✅ JWT Secret from env
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

router.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// ---------- LOCAL AUTH ----------

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await getDB().run(
      "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, phone]
    );

    const token = jwt.sign({ id: result.lastID, email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: { id: result.lastID, name, email, phone },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to register", details: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getDB().get("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// Get logged-in user
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await getDB().get(
      "SELECT id, name, email, phone FROM users WHERE id = ?",
      [req.user.id]
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user", details: err.message });
  }
});

// ---------- GOOGLE AUTH ----------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.emails || !profile.emails.length) {
          return done(new Error("No email found in Google profile"), null);
        }

        let user = await getDB().get(
          "SELECT * FROM users WHERE email = ?",
          [profile.emails[0].value]
        );

        if (!user) {
          const result = await getDB().run(
            "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
            [profile.displayName, profile.emails[0].value, "", ""]
          );
          user = { id: result.lastID, name: profile.displayName, email: profile.emails[0].value };
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/login` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, email: req.user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.redirect(`${FRONTEND_URL}/login?token=${token}`);
  }
);

export default router;
