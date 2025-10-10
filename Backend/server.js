// server.js
import 'dotenv/config';
import express from "express";
import session from "express-session";
import passport from "passport";

import { initDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import rideRoutes from "./routes/rides.js";
import userRoutes from "./routes/users.js";

const app = express();

// ---------- CONFIG ----------
const FRONTEND_ORIGINS = [
  "http://localhost:4173", // dev frontend
  "https://68e85d48bd9b1607365df791--willowy-haupia-6fb17a.netlify.app", // deployed frontend
  process.env.FRONTEND_URL, // optional env override
].filter(Boolean);

// ---------- CORS MIDDLEWARE ----------
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (FRONTEND_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  }

  // Preflight OPTIONS request
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---------- JSON PARSER ----------
app.use(express.json());

// ---------- SESSION ----------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none", // for cross-site cookies (Netlify ↔ Render)
      secure: process.env.NODE_ENV === "production", // only true on HTTPS
      httpOnly: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---------- DATABASE ----------
await initDB();

// ---------- ROUTES ----------
app.get("/", (req, res) => {
  res.send("✅ Carpool backend is running");
});

app.use("/auth", authRoutes);
app.use("/rides", rideRoutes);
app.use("/users", userRoutes);

// ---------- ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ error: err.message });
});

// ---------- PORT ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚗 Backend running on port ${PORT}`);
});
