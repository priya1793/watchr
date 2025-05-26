import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWatchlist } from "../store/watchlistStore";
import { MovieCard } from "../components/MovieCard";
import { omdb } from "../lib/omdb";
import type { OmdbMovie } from "../types";
import { motion } from "framer-motion";
import { Input } from "../components/ui/input";
import { useAuthStore } from "../store/authStore";

function Home() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const token = useAuthStore((state) => state.token);
  const {
    watchlist,
    addMovie,
    removeMovie,
    fetchWatchlist,
    updateMovieDetails,
  } = useWatchlist();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   setIsAuthenticated(!!token);
  // }, []);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (token) {
      fetchWatchlist();
    }
  }, [fetchWatchlist, token]);

  const {
    data: movies = [],
    isLoading,
    isError,
  } = useQuery<OmdbMovie[]>({
    queryKey: ["omdb", debouncedQuery || "batman"],
    queryFn: async () => {
      const term = debouncedQuery || "batman";
      const res = await omdb.get("", {
        params: { s: term, type: "movie" },
      });
      return res.data.Search || [];
    },
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });

  const handleAdd = async (movie: OmdbMovie) => {
    await addMovie({
      movieId: movie.imdbID,
      title: movie.Title,
      posterPath: movie.Poster,
      year: movie.Year,
    });
    // fetchWatchlist();
  };

  // const handleRemove = async (movieId: string) => {
  //   await removeMovie(movieId);
  //   fetchWatchlist();
  // };

  const handleRemove = (movieId: string) => {
    removeMovie(movieId);
  };

  const handleStatusChange = (
    movieId: string,
    newStatus: "Watched" | "Watching" | "Plan to Watch"
  ) => {
    updateMovieDetails(movieId, { status: newStatus });
  };

  const isInWatchlist = (imdbID: string) =>
    watchlist.some((m) => m.movieId === imdbID);

  const getWatchlistItem = (imdbID: string) => {
    return watchlist.find((item) => item.movieId === imdbID);
  };

  return (
    <motion.div
      className="p-4 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold my-4">🎬 Explore Movies</h1>
      <Input
        type="text"
        className="px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-900 placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                   dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400
                   dark:focus:ring-primary dark:focus:border-primary
                   transition-colors duration-200 mb-5"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching movies.</p>}
      {!isLoading && movies?.length === 0 && debouncedQuery && (
        <p>No results found.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {movies?.map((movie: OmdbMovie) => {
          const inWatchlist = isInWatchlist(movie.imdbID);
          const savedMovie = getWatchlistItem(movie.imdbID);

          return (
            <MovieCard
              key={movie.imdbID}
              movie={inWatchlist ? savedMovie! : movie}
              isInWatchlist={inWatchlist}
              onAdd={() => handleAdd(movie)}
              onRemove={() => handleRemove(movie.imdbID)}
              onStatusChange={handleStatusChange}
              // movie={{
              //   movieId: movie.imdbID,
              //   title: movie.Title,
              //   posterPath: movie.Poster,
              //   year: movie.Year,
              // }}
              // watched={false}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export default Home;
