import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { getDB } from "../db.js";
import { JWT_SECRET, verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ------------------- SESSION & PASSPORT ------------------- //
// Session required for Passport (optional if you only use JWT)
router.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

router.use(passport.initialize());
router.use(passport.session());

// ------------------- LOCAL AUTH ------------------- //

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await getDB().run(
      "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, phone]
    );
    res.json({ id: result.lastID, message: "User registered successfully" });
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
  const user = await getDB().get(
    "SELECT id, name, email, phone FROM users WHERE id = ?",
    [req.user.id]
  );
  res.json(user);
});

// ------------------- GOOGLE AUTH ------------------- //

// 🔹 Debug: log Google Client ID before using it
console.log("GOOGLE_CLIENT_ID from .env:", process.env.GOOGLE_CLIENT_ID);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await getDB().get("SELECT * FROM users WHERE email = ?", [
          profile.emails[0].value,
        ]);

        if (!user) {
          const result = await getDB().run(
            "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
            [profile.displayName, profile.emails[0].value, "", ""]
          );
          user = { id: result.lastID, name: profile.displayName, email: profile.emails[0].value };
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Step 1: Redirect to Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.redirect(`http://localhost:5173/login?token=${token}`);
  }
);

export default router;
