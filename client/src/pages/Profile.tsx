import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GENRES = [
  "Horror",
  "Action",
  "Thriller",
  "Drama",
  "Science Fiction",
  "Romance",
  "Comedy",
  "Western",
  "Crime",
  "Animation",
  "Documentary",
  "Fantasy",
  "Experimental",
  "Adventure",
  "Musical",
  "Mystery",
  "Noir",
  "Historical Film",
  "Crime Fiction",
  "Magical Realism",
  "Dark Fantasy",
  "Cyberpunk",
  "Satire",
  "Dark Comedy",
  "Melodrama",
  "War",
  "Exploitation",
  "Heist",
  "Narrative",
  "Wuxia",
  "Art",
  "Short",
  "Abstract animation film",
];

interface UserProfile {
  username: string;
  email: string;
  favoriteGenres: string[];
  stats: {
    moviesWatched: number;
    watchlistCount: number;
  };
}

export default function Profile() {
  const token = useAuthStore((state) => state.token);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editingGenres, setEditingGenres] = useState<string[]>([]);
  const [genreQuery, setGenreQuery] = useState("");

  const filteredGenreOptions = GENRES.filter(
    (g) =>
      g.toLowerCase().includes(genreQuery.toLowerCase()) &&
      !editingGenres.includes(g)
  );

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setEditingGenres(res.data.favoriteGenres);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleAddGenre = (genre: string) => {
    setEditingGenres([...editingGenres, genre]);
    setGenreQuery("");
  };

  const handleRemoveGenre = (genre: string) => {
    setEditingGenres(editingGenres.filter((g) => g !== genre));
  };

  const handleSaveGenres = async () => {
    try {
      await axios.put(
        "/api/profile",
        { favoriteGenres: editingGenres },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile((prev) => prev && { ...prev, favoriteGenres: editingGenres });
    } catch (err) {
      console.error("Failed to save genres:", err);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/placeholder-avatar.png" />
          <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{profile.username}</h2>
          <p className="text-muted-foreground text-sm">{profile.email}</p>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4 mb-10"
      >
        <div className="mb-10">
          <p className="text-sm text-muted-foreground">Movies Watched</p>
          <Progress value={Math.min(profile.stats.moviesWatched, 100)} />
          <p className="text-xs mt-1">{profile.stats.moviesWatched} / 100</p>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Watchlist", count: profile.stats.watchlistCount },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Favorite Genres Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h3 className="text-lg font-medium">🎬 Favorite Genres</h3>

        <div className="flex flex-wrap gap-2">
          {editingGenres.map((genre) => (
            <span
              key={genre}
              className="bg-secondary text-sm rounded-full px-3 py-1 flex items-center gap-2"
            >
              {genre}
              <button
                className="text-red-500 text-xs"
                onClick={() => handleRemoveGenre(genre)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        {/* Genre Autocomplete */}
        <Input
          placeholder="Add genre..."
          value={genreQuery}
          onChange={(e) => setGenreQuery(e.target.value)}
        />
        {genreQuery && (
          <div className="bg-popover rounded shadow p-2 mt-1 max-h-40 overflow-y-auto">
            {filteredGenreOptions.map((genre) => (
              <div
                key={genre}
                className="cursor-pointer hover:bg-muted px-2 py-1 rounded"
                onClick={() => handleAddGenre(genre)}
              >
                {genre}
              </div>
            ))}
            {filteredGenreOptions.length === 0 && (
              <div className="text-muted-foreground text-sm px-2">
                No matches
              </div>
            )}
          </div>
        )}

        <Button onClick={handleSaveGenres} className="mt-2">
          Save Genres
        </Button>
      </motion.div>
    </div>
  );
}
