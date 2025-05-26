import { MovieCard } from "../components/MovieCard";
import { useWatchlist } from "../store/watchlistStore";
import type { WatchlistMovie } from "../types";
import { motion } from "framer-motion";

function Watchlist() {
  const { watchlist, removeMovie, updateMovieDetails } = useWatchlist();

  const toggleWatchStatus = (movieId: string, currentStatus?: string) => {
    const newStatus: "Watched" | "Plan to Watch" =
      currentStatus === "Watched" ? "Plan to Watch" : "Watched";
    updateMovieDetails(movieId, { status: newStatus });
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-2xl font-bold mb-4">⭐ Your Watchlist</h1>

      {watchlist.length === 0 && <p>No movies in watchlist.</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {watchlist.map((movie: WatchlistMovie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            onRemove={removeMovie}
            onStatusChange={
              () => toggleWatchStatus(movie.movieId, movie.status)
              // watched={movie.watched}
              // onToggleWatched={toggleWatchedStatus}
            }
          />
        ))}
      </div>
    </motion.div>
  );
}

export default Watchlist;
