import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { omdb } from "../lib/omdb";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MovieCard } from "../components/MovieCard";
import { useWatchlist } from "../store/watchlistStore";
import {
  FaLanguage,
  FaGlobeAmericas,
  FaMoneyBillWave,
  FaFilm,
  FaLink,
  FaCheck,
  FaPlus,
  FaHeart,
  FaShareAlt,
  FaTags,
  FaStar,
} from "react-icons/fa";
import toast from "react-hot-toast";

interface Rating {
  Source: string;
  Value: string;
}

export interface Movie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: "True" | "False";
  Error?: string;
}

interface OmdbSearchResult {
  Search: Movie[];
  totalResults: string;
  Response: "True" | "False";
  Error?: string;
}

const MovieDetails = () => {
  const { imdbID } = useParams<{ imdbID: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { watchlist, addMovie, removeMovie } = useWatchlist();
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const fetchSimilarMovies = async (movieData: Movie) => {
    try {
      setLoadingSimilar(true);
      const searchQuery =
        movieData.Genre?.split(",")[0].trim() ??
        movieData.Actors?.split(",")[0].trim();

      if (!searchQuery) return;

      const res = await omdb.get<OmdbSearchResult>("", {
        params: { s: searchQuery },
      });

      if (res.data.Response === "True") {
        const filtered = res.data.Search.filter(
          (m) => m.imdbID !== movieData.imdbID
        );
        setSimilarMovies(filtered);
      }
    } catch (err) {
      console.error("Failed to fetch similar movies:", err);
    } finally {
      setLoadingSimilar(false);
    }
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const res = await omdb.get("", {
          params: {
            i: imdbID,
            plot: "full",
          },
        });

        if (res.data.Response === "True") {
          setMovie(res.data);
          fetchSimilarMovies(res.data);
        } else {
          console.error(res.data.Error);
        }
      } catch (err) {
        setError("Something went wrong!" + err);
      } finally {
        setLoading(false);
      }
    };

    if (imdbID) fetchMovie();
  }, [imdbID]);

  // Check if the movie is already in the watchlist on load
  useEffect(() => {
    if (movie) {
      const exists = watchlist.some((m) => m.movieId === movie.imdbID);
      setIsInWatchlist(exists);
    }
  }, [movie, watchlist]);

  const handleToggleWatchlist = async () => {
    if (!movie) return;

    if (isInWatchlist) {
      await removeMovie(movie.imdbID);
      toast.success(`Removed "${movie.Title}" from Watchlist`);
      setIsInWatchlist(false);
    } else {
      await addMovie({
        movieId: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        posterPath: movie.Poster,
      });
      toast.success(`Added "${movie.Title}" to Watchlist`);
      setIsInWatchlist(true);
    }
  };

  const handleMarkAsWatched = () => {
    if (movie) {
      toast.success(`Marked "${movie.Title}" as Watched`);
    }
  };

  const handleAddToFavorites = () => {
    if (movie) {
      toast.success(`"${movie.Title}" added to Favorites ❤️`);
    }
  };

  const handleRateMovie = () => {
    if (!movie) return;
    const rating = prompt("Rate this movie (1-10):");
    if (rating) {
      toast.success(`You rated "${movie.Title}" ${rating}/10 ⭐`);
    }
  };

  const handleShareMovie = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://www.imdb.com/title/${movie.imdbID}`
      );
      toast.success("IMDb URL copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link" + error);
    }
  };

  const handleTagMovie = () => {
    const tag = prompt("Add a tag (e.g., 'Weekend Chill'):");
    if (tag) {
      toast.success(`Tagged as "${tag}"`);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    );
  }

  if (!movie || movie.Response === "False") {
    return <p className="text-red-500 text-center mt-10">Movie not found.</p>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 font-semibold text-center">{error}</div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        ← Back to Movies
      </Button>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
          alt={movie.Title}
          className="w-full md:w-64 rounded-lg shadow-lg object-cover"
        />

        {/* Info + Actions */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              {movie.Title} ({movie.Year})
            </h1>
            <p className="text-muted-foreground">{movie.Plot}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 flex-wrap mt-6">
            <Button
              onClick={handleToggleWatchlist}
              className={`${
                isInWatchlist ? "bg-red-600" : "bg-indigo-600"
              } text-white transition`}
            >
              {isInWatchlist ? (
                <>
                  <FaCheck className="mr-2" /> Remove from Watchlist
                </>
              ) : (
                <>
                  <FaPlus className="mr-2" /> Add to Watchlist
                </>
              )}
            </Button>

            <Button onClick={handleMarkAsWatched} variant="secondary">
              <FaCheck className="mr-2" /> Mark as Watched
            </Button>

            <Button onClick={handleAddToFavorites} variant="ghost">
              <FaHeart className="mr-2 text-red-500" /> Like
            </Button>

            <Button onClick={handleRateMovie} variant="outline">
              <FaStar className="mr-2 text-yellow-500" /> Rate
            </Button>

            <Button onClick={handleShareMovie} variant="outline">
              <FaShareAlt className="mr-2" /> Share
            </Button>

            <Button onClick={handleTagMovie} variant="outline">
              <FaTags className="mr-2" /> Tag
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap mt-4">
            {movie.Genre.split(",").map((genre) => (
              <Badge
                key={genre}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full hover:scale-105 transition-transform duration-200"
              >
                🎬 {genre.trim()}
              </Badge>
            ))}
          </div>

          <div className="space-y-1 text-md">
            <p>
              <strong>Director:</strong> {movie.Director}
            </p>
            <p>
              <strong>Actors:</strong> {movie.Actors}
            </p>
            <p>
              <strong>Runtime:</strong> {movie.Runtime}
            </p>
            <p>
              <strong>Rated:</strong> {movie.Rated}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {movie.Ratings.map((r) => (
              <Badge className="py-1 px-2" key={r.Source}>
                {r.Source}: {r.Value}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Info Card */}
      <Card className="mt-6 bg-white shadow-md rounded-xl border border-gray-200">
        <CardContent className="p-6 text-sm text-gray-700 space-y-4">
          <div className="flex items-center gap-3">
            <FaLanguage className="text-gray-500 w-5 h-5" />
            <span className="font-semibold uppercase tracking-wide">
              Language:
            </span>
            <span>{movie.Language}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaGlobeAmericas className="text-gray-500 w-5 h-5" />
            <span className="font-semibold uppercase tracking-wide">
              Country:
            </span>
            <span>{movie.Country}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaMoneyBillWave className="text-gray-500 w-5 h-5" />
            <span className="font-semibold uppercase tracking-wide">
              Box Office:
            </span>
            <span>{movie.BoxOffice}</span>
          </div>

          <div className="flex items-center gap-3">
            <FaFilm className="text-gray-500 w-5 h-5" />
            <span className="font-semibold uppercase tracking-wide">
              Production:
            </span>
            <span>{movie.Production}</span>
          </div>

          {movie.Website !== "N/A" && (
            <div className="flex items-center gap-3">
              <FaLink className="text-gray-500 w-5 h-5" />
              <span className="font-semibold uppercase tracking-wide">
                Website:
              </span>
              <a
                href={movie.Website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:underline"
              >
                {movie.Website}
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {loadingSimilar ? (
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/4" />
          <div className="flex gap-4 overflow-x-auto">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="w-40 h-60 rounded" />
            ))}
          </div>
        </div>
      ) : (
        similarMovies.length > 0 && (
          <div className="mt-10 space-y-2">
            <h2 className="text-xl font-semibold">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {similarMovies
                .filter((m) => m.imdbID !== movie.imdbID)
                .map((m) => (
                  <MovieCard key={m.imdbID} movie={m} />
                ))}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default MovieDetails;
