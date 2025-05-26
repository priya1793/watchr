import { time } from "console";
import mongoose, { Schema, Document } from "mongoose";

export interface IWatchlistItem extends Document {
  user: mongoose.Types.ObjectId;
  movieId: string;
  title: string;
  year: string;
  posterPath: string;
  watched: boolean;
  status?: "Watching" | "Watched" | "Plan to Watch";
  note?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const watchlistItemSchema = new Schema<IWatchlistItem>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: String },
    posterPath: { type: String },
    watched: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Watching", "Watched", "Plan to Watch"],
      default: "Plan to Watch",
    },
    note: { type: String },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const WatchlistItem = mongoose.model<IWatchlistItem>(
  "Watchlist",
  watchlistItemSchema
);

export default WatchlistItem;
