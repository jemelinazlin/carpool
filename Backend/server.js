import 'dotenv/config';
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import { initDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import rideRoutes from "./routes/rides.js";
import userRoutes from "./routes/users.js";

const app = express();
app.use(express.json());

// ---------- CORS ----------
const allowedOrigins = [
  "http://localhost:4173", // Vite dev
  "https://68e85a14b8c2e700085e1d99--willowy-haupia-6fb17a.netlify.app", // Netlify frontend
  process.env.FRONTEND_URL, // optional override from env
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") return res.sendStatus(204); // preflight
    next();
  } else {
    console.warn(`❌ CORS blocked for origin: ${origin}`);
    res.status(403).json({ error: "CORS blocked" });
  }
});

// ---------- SESSION ----------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none", // cross-site
      secure: process.env.NODE_ENV === "production",
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
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({ error: err.message });
});

// ---------- PORT ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚗 Backend running on port ${PORT}`);
});
