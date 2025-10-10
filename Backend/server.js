import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import { initDB } from "./db.js";
import authRoutes from "./routes/auth.js";
import rideRoutes from "./routes/rides.js";
import userRoutes from "./routes/users.js";

const app = express();

// ---------- ENV DETECTION ----------
const isProduction = process.env.NODE_ENV === "production";

// Auto-select frontend URLs
const FRONTEND_URL = isProduction
  ? "https://willowy-haupia-6fb17a.netlify.app" // Netlify frontend
  : "http://localhost:5174"; // Local Vite dev server

const BACKEND_URL = isProduction
  ? "https://carpool-1-wrch.onrender.com" // Render backend
  : "http://localhost:5000"; // Local backend

// ---------- CORS CONFIG ----------
const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:5174", // fallback if Vite switches ports
  "https://willowy-haupia-6fb17a.netlify.app", // production
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith("--willowy-haupia-6fb17a.netlify.app")
      ) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked CORS request from:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
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
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction, // HTTPS only in production
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
  console.log(`🌍 Frontend URL: ${FRONTEND_URL}`);
  console.log(`⚙️ Mode: ${isProduction ? "Production" : "Development"}`);
});
