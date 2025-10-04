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
  "http://localhost:5173", // local dev
  process.env.FRONTEND_URL || "https://willowy-haupia-6fb17a.netlify.app", // deployed frontend
];

app.use(
  cors({
    origin: function(origin, callback) {
      console.log("Request origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---------- SESSION ----------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---------- DATABASE ----------
await initDB();

// ---------- ROUTES ----------
app.use("/auth", authRoutes);
app.use("/rides", rideRoutes);
app.use("/users", userRoutes);

// ---------- PORT ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚗 Backend running at port ${PORT}`));
