// server.js
import 'dotenv/config';
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import { initDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import rideRoutes from "./routes/rides.js";
import userRoutes from "./routes/users.js";

const app = express();

// ---------- CORS CONFIG ----------
const allowedOrigins = [
  "http://localhost:4173", // local dev
  "https://willowy-haupia-6fb17a.netlify.app" // main production Netlify domain
];

// Use cors() with dynamic origin checking
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || // allow non-browser requests (e.g. Postman)
        allowedOrigins.includes(origin) ||
        origin.endsWith("--willowy-haupia-6fb17a.netlify.app") // any Netlify preview deploy
      ) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked CORS request from origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // allow cookies/sessions across sites
  })
);

// ---------- JSON PARSER ----------
app.use(express.json());

// ---------- SESSION ----------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none", // allow Netlify ↔ Render cookies
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
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
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({ error: err.message });
});

// ---------- PORT ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚗 Backend running on port ${PORT}`);
});
