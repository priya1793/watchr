import type { OmdbMovie, WatchlistMovie } from "../types";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface MovieCardProps {
  movie: OmdbMovie | WatchlistMovie;
  isInWatchlist?: boolean;
  watched?: boolean;
  onAdd?: (movie: OmdbMovie | WatchlistMovie) => void;
  onRemove?: (movieId: string) => void;
  onStatusChange?: (
    movieId: string,
    newStatus: "Watching" | "Watched" | "Plan to Watch"
  ) => void;
}

export function MovieCard({
  movie,
  isInWatchlist = false,
  watched = false,
  onAdd,
  onRemove,
  onStatusChange,
}: MovieCardProps) {
  const isWatchlistMovie = "movieId" in movie;
  const id = isWatchlistMovie ? movie.movieId : movie.imdbID;
  const title = isWatchlistMovie ? movie.title : movie.Title;
  const year = isWatchlistMovie ? movie.year : movie.Year;
  const poster = isWatchlistMovie ? movie.posterPath : movie.Poster;
  const status = isWatchlistMovie ? movie.status : undefined;

  const handleStatusChange = (
    newStatus: "Watching" | "Watched" | "Plan to Watch"
  ) => {
    if (isWatchlistMovie && onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };

  return (
    <motion.div
      className="rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition p-4 flex flex-col items-center gap-4 overflow-hidden"
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/movie/${id}`}>
        <img
          src={
            poster && poster !== "N/A"
              ? poster
              : "https://via.placeholder.com/200x300?text=No+Image"
          }
          alt={title}
          className="rounded-lg w-full max-w-[200px] h-auto object-cover"
        />
      </Link>

      <div className="text-center space-y-1">
        <h2 className="text-md font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{year}</p>
      </div>

      <div className="p-3">
        {isInWatchlist && isWatchlistMovie && (
          <>
            {/* Dropdown for status */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="mb-2 w-full text-xs"
                >
                  {status || "Set Status"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {["Watching", "Watched", "Plan to Watch"].map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() =>
                      handleStatusChange(
                        s as "Watching" | "Watched" | "Plan to Watch"
                      )
                    }
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        <div className="flex justify-between gap-2">
          {isInWatchlist ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove?.(id)}
            >
              Remove from Watchlist
            </Button>
          ) : (
            <Button size="sm" onClick={() => onAdd?.(movie)}>
              Add to Watchlist
            </Button>
          )}
        </div>
      </div>

      {/* <div className="flex flex-wrap justify-center gap-2 mt-2">
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
      </div> */}
    </motion.div>
  );
}
