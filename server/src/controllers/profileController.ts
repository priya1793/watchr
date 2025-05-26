import { Request, Response } from "express";
import User from "../models/User";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select(
      "username email favoriteGenres stats"
    );
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateFavoriteGenres = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { favoriteGenres } = req.body;

    if (!Array.isArray(favoriteGenres)) {
      res.status(400).json({ error: "favoriteGenres must be an array" });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { favoriteGenres },
      { new: true }
    ).select("favoriteGenres");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update favorite genres" });
  }
};
