import toast from "react-hot-toast";
import axios from "../api/axios";
import { create } from "zustand";

interface Movie {
  _id?: string;
  movieId: string;
  title: string;
  year: string;
  posterPath: string;
  // watched: boolean;
  status?: "Watching" | "Watched" | "Plan to Watch";
  note?: string;
  tags?: string[];
}

interface WatchlistState {
  watchlist: Movie[];
  fetchWatchlist: () => Promise<void>;
  addMovie: (movie: Omit<Movie, "_id" | "watched">) => Promise<void>;
  removeMovie: (movieId: string) => Promise<void>;
  // toggleWatchedStatus: (movieId: string) => Promise<void>;
  // updateMovieStatus: (
  //   movieId: string,
  //   status: Movie["status"]
  // ) => Promise<void>;
  // updateMovieNote: (movieId: string, note: string) => Promise<void>;
  // updateMovieTags: (movieId: string, tags: string[]) => Promise<void>;
  updateMovieDetails: (
    movieId: string,
    data: { status?: Movie["status"]; note?: string; tags?: string[] }
  ) => Promise<void>;
  clearWatchlist: () => void;
}

export const useWatchlist = create<WatchlistState>((set, get) => ({
  // Initialize state from localStorage to avoid empty UI on reload
  // watchlist: (() => {
  //   try {
  //     const stored = localStorage.getItem("watchlist");
  //     return stored ? JSON.parse(stored) : [];
  //   } catch {
  //     return [];
  //   }
  // })(),

  watchlist: [],

  fetchWatchlist: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({ watchlist: [] });
      return;
    }

    try {
      const res = await axios.get("/api/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ watchlist: res.data });
    } catch (err) {
      toast.error("Failed to fetch watchlist");
      set({ watchlist: [] });
      console.error("Failed to fetch watchlist:", err);
    }
  },

  addMovie: async (movie) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.post(
        "/api/watchlist",
        { ...movie },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => {
        const updated = [...state.watchlist, res.data];
        return { watchlist: updated };
      });

      toast.success("Movie added to watchlist");
    } catch (err) {
      console.error("Failed to add movie:", err);
      toast.error("Failed to add movie");
    }
  },

  removeMovie: async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`/api/watchlist/${movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => {
        const updated = state.watchlist.filter((m) => m.movieId !== movieId);
        return { watchlist: updated };
      });

      toast.success("Movie removed from watchlist");
    } catch (err) {
      console.error("Failed to remove movie:", err);
      toast.error("Failed to remove movie");
    }
  },

  /*updateMovieStatus: async (movieId, status) => {
    await axios.patch(`/watchlist/${movieId}/status`, { status });
    set((state) => ({
      watchlist: state.watchlist.map((m) =>
        m.movieId === movieId ? { ...m, status } : m
      ),
    })),
    toast.success(`Marked as "${status}"`);
  },

  updateMovieNote: async (movieId, note) => {
    await axios.patch(`/watchlist/${movieId}/note`, { note });
    set((state) => ({
      watchlist: state.watchlist.map((m) =>
        m.movieId === movieId ? { ...m, note } : m
      ),
    })),
  },

  updateMovieTags: async (movieId, tags) => {
    await axios.patch(`/watchlist/${movieId}/tags`, { tags });
    set((state) => ({
      watchlist: state.watchlist.map((m) =>
        m.movieId === movieId ? { ...m, tags } : m
      ),
    })),
  },*/

  updateMovieDetails: async (movieId, data) => {
    try {
      await axios.put(`/api/watchlist/${movieId}`, data);
      set((state) => ({
        watchlist: state.watchlist.map((m) =>
          m.movieId === movieId ? { ...m, ...data } : m
        ),
      }));
      toast.success("Movie updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update movie");
    }
  },

  clearWatchlist: () => set({ watchlist: [] }),

  // toggleWatchedStatus: async (movieId) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     const current = get().watchlist.find((m) => m.movieId === movieId);
  //     if (!current) return;

  //     // Determine next status (toggle Watched <-> Plan to Watch)
  //     const nextStatus =
  //       current.status === "Watched" ? "Plan to Watch" : "Watched";

  //     const res = await axios.put(
  //       `/api/watchlist/${movieId}`,
  //       { watched: nextStatus },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     set((state) => {
  //       const updated = state.watchlist.map((m) =>
  //         m.movieId === movieId ? res.data : m
  //       );
  //       localStorage.setItem("watchlist", JSON.stringify(updated));
  //       return { watchlist: updated };
  //     });

  //     toast.success("Watched status updated");
  //   } catch (err) {
  //     console.error("Failed to toggle watched status:", err);
  //     toast.error("Failed to update watched status");
  //   }
  // },
}));
