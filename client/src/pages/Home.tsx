import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWatchlist } from "../store/watchlistStore";
import { MovieCard } from "../components/MovieCard";
import { omdb } from "../lib/omdb";
import type { OmdbMovie } from "../types";
import { motion } from "framer-motion";
import { Input } from "../components/ui/input";

function Home() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { watchlist, addMovie, removeMovie, fetchWatchlist } = useWatchlist();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWatchlist();
    }
  }, [fetchWatchlist, isAuthenticated]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(handler);
  }, [query]);

  const {
    data: movies = [],
    isLoading,
    isError,
  } = useQuery<OmdbMovie[]>({
    queryKey: ["movies", debouncedQuery],
    queryFn: async () => {
      const term = debouncedQuery || "batman";
      const res = await omdb.get("", {
        params: { s: term, type: "movie" },
      });
      return res.data.Search || [];
    },
    enabled: !!debouncedQuery || true,
  });

  const isInWatchlist = (imdbID: string) =>
    watchlist.some((m) => m.movieId === imdbID);

  const handleAdd = async (movie: OmdbMovie) => {
    await addMovie({
      movieId: movie.imdbID,
      title: movie.Title,
      posterPath: movie.Poster,
      year: movie.Year,
    });
    fetchWatchlist();
  };

  const handleRemove = async (movieId: string) => {
    await removeMovie(movieId);
    fetchWatchlist();
  };

  return (
    <motion.div
      className="p-4 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Input
        type="text"
        className="w-full p-2 border rounded mb-4"
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
          return (
            <MovieCard
              key={movie.imdbID}
              movie={{
                movieId: movie.imdbID,
                title: movie.Title,
                posterPath: movie.Poster,
                year: movie.Year,
              }}
              watched={false}
              isInWatchlist={inWatchlist}
              onAdd={() => handleAdd(movie)}
              onRemove={() => handleRemove(movie.imdbID)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export default Home;
