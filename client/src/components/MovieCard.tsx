import type { OmdbMovie, WatchlistMovie } from "../types";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

interface MovieCardProps {
  movie: OmdbMovie | WatchlistMovie;
  isInWatchlist?: boolean;
  watched?: boolean;
  onAdd?: (movie: OmdbMovie | WatchlistMovie) => void;
  onRemove?: (movieId: string) => void;
  onToggleWatched?: (movieId: string) => void;
}

export function MovieCard({
  movie,
  isInWatchlist = false,
  watched = false,
  onAdd,
  onRemove,
  onToggleWatched,
}: MovieCardProps) {
  const id = "imdbID" in movie ? movie.imdbID : movie.movieId;
  const title = "Title" in movie ? movie.Title : movie.title;
  const year = "Year" in movie ? movie.Year : movie.year;
  const poster = "Poster" in movie ? movie.Poster : movie.posterPath;

  return (
    <motion.div
      className="rounded-xl bg-card text-card-foreground shadow hover:shadow-lg transition p-4 flex flex-col items-center gap-4 overflow-hidden"
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={
          poster && poster !== "N/A"
            ? poster
            : "https://via.placeholder.com/200x300?text=No+Image"
        }
        alt={title}
        className="rounded-lg w-full max-w-[200px] h-auto object-cover"
      />

      <div className="text-center space-y-1">
        <h2 className="text-md font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{year}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {onAdd && onRemove && (
          <Button
            className={`${
              isInWatchlist
                ? "bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
                : "bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
            }`}
            size="sm"
            onClick={() => (isInWatchlist ? onRemove(id) : onAdd(movie))}
          >
            {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
          </Button>
        )}

        {onToggleWatched && onRemove && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleWatched(id)}
            >
              {watched ? "✅ Watched" : "Mark as Watched"}
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(id)}
            >
              Remove
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
