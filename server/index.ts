import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes";
import profileRoutes from "./src/routes/profileRoutes";
import watchlistRoutes from "./src/routes/watchlistRoutes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/watchlist", watchlistRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log("MongoDB connected");
  app.listen(5000, () => console.log("Server running on port 5000"));
});
