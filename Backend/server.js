// ✅ Load environment variables at the very top
import 'dotenv/config';

import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import { initDB } from "./db.js";

import authRoutes from "./routes/auth.js";
import rideRoutes from "./routes/rides.js";
import userRoutes from "./routes/users.js";

// Debug environment variables
console.log("GOOGLE_CLIENT_ID from .env:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET from .env:", process.env.GOOGLE_CLIENT_SECRET);

const app = express();
app.use(express.json());

// ✅ allow frontend (5173) to call backend (5000)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Optional: session required for passport (not strictly needed if using JWT)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Initialize DB
await initDB();

// Routes
app.use("/auth", authRoutes);
app.use("/rides", rideRoutes);
app.use("/users", userRoutes);

// Start server
app.listen(5000, () =>
  console.log("🚗 Backend running at http://localhost:5000")
);
