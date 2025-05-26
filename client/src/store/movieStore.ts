import { create } from "zustand";

export const useMovieStore = create((set) => ({
  selectedMovie: null,
  setSelectedMovie: (movie: any) => set({ selectedMovie: movie }),
}));
