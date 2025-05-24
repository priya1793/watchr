import toast from "react-hot-toast";
import axios from "../api/axios";
import { create } from "zustand";

interface Movie {
  _id?: string;
  movieId: string;
  title: string;
  year: string;
  posterPath: string;
  watched?: boolean;
}

interface WatchlistState {
  watchlist: Movie[];
  fetchWatchlist: () => Promise<void>;
  addMovie: (movie: Omit<Movie, "_id" | "watched">) => Promise<void>;
  removeMovie: (movieId: string) => Promise<void>;
  toggleWatched: (movieId: string) => Promise<void>;
}

export const useWatchlist = create<WatchlistState>((set, get) => ({
  // Initialize state from localStorage to avoid empty UI on reload
  watchlist: (() => {
    try {
      const stored = localStorage.getItem("watchlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })(),

  fetchWatchlist: async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(res.data)) {
        console.error("Unexpected API response:", res.data);
        set({ watchlist: [] });
        return;
      }

      set({ watchlist: res.data });
      localStorage.setItem("watchlist", JSON.stringify(res.data));
    } catch (err) {
      toast.error("Failed to fetch watchlist");
      console.error("Failed to fetch watchlist:", err);
    }
  },

  addMovie: async (movie) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/watchlist",
        { ...movie },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => {
        const updated = [...state.watchlist, res.data];
        localStorage.setItem("watchlist", JSON.stringify(updated));
        return { watchlist: updated };
      });

      toast.success("Movie added to watchlist");
    } catch (err) {
      console.error("Failed to add movie:", err);
      toast.error("Failed to add movie");
    }
  },

  removeMovie: async (movieId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/watchlist/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => {
        const updated = state.watchlist.filter((m) => m.movieId !== movieId);
        localStorage.setItem("watchlist", JSON.stringify(updated));
        return { watchlist: updated };
      });

      toast.success("Movie removed from watchlist");
    } catch (err) {
      console.error("Failed to remove movie:", err);
      toast.error("Failed to remove movie");
    }
  },

  toggleWatched: async (movieId) => {
    try {
      const token = localStorage.getItem("token");
      const current = get().watchlist.find((m) => m.movieId === movieId);
      if (!current) return;

      const res = await axios.put(
        `/api/watchlist/${movieId}`,
        { watched: !current.watched },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => {
        const updated = state.watchlist.map((m) =>
          m.movieId === movieId ? res.data : m
        );
        localStorage.setItem("watchlist", JSON.stringify(updated));
        return { watchlist: updated };
      });

      toast.success("Watched status updated");
    } catch (err) {
      console.error("Failed to toggle watched status:", err);
      toast.error("Failed to update watched status");
    }
  },
}));
