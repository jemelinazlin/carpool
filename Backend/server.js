import express from "express";
import cors from "cors";
import { initDB } from "./db.js";

import authRoutes from "./routes/auth.js";
import rideRoutes from "./routes/rides.js";
import userRoutes from "./routes/users.js";

const app = express();
app.use(express.json());

// ✅ allow frontend (5173) to call backend (5000)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
