import { Response } from "express";
import { AuthRequest } from "../types/express";
import WatchlistItem from "../models/WatchlistItem";

export const getWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const items = await WatchlistItem.find({ user: userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to get watchlist" });
  }
};

export const addToWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { movieId, title, year, posterPath, status, note, tags } = req.body;

    if (!movieId || !title) {
      res.status(400).json({ error: "movieId and title are required" });
    }

    // Prevent duplicates for same user + movieId
    const exists = await WatchlistItem.findOne({ user: userId, movieId });
    if (exists) {
      res.status(400).json({ error: "Movie already in watchlist" });
    }

    const newItem = new WatchlistItem({
      user: userId,
      movieId,
      title,
      year,
      posterPath,
      status: status || "Plan to Watch",
      note: note || "",
      tags: tags || [],
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to add to watchlist" });
  }
};

export const removeFromWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { movieId } = req.params;

    const deleted = await WatchlistItem.findOneAndDelete({
      // _id: id,
      movieId,
      user: userId,
    });

    console.log("deleted: ", deleted);

    if (!deleted) {
      res.status(404).json({ error: "Watchlist item not found" });
      return;
    }

    res.json({ message: "Removed from watchlist" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove from watchlist" });
  }
};

export const updateWatchedItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { movieId } = req.params;
    const { status, note, tags } = req.body;

    const item = await WatchlistItem.findOne({ user: userId, movieId });

    if (!item) {
      res.status(404).json({ error: "Movie not found in watchlist" });
      return;
    }

    if (status) item.status = status;
    if (note !== undefined) item.note = note;
    if (tags !== undefined) item.tags = tags;

    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update watchlist item" });
  }
};
