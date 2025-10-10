// server.js
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
  "http://localhost:4173", // your Vite dev server
  "https://willowy-haupia-6fb17a.netlify.app", // deployed frontend
  process.env.FRONTEND_URL, // optional override
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ CORS blocked for origin: ${origin}`);
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true, // allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---------- SESSION ----------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "none", // needed for cross-site cookies
      secure: process.env.NODE_ENV === "production", // only secure in prod (Render)
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
