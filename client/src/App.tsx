import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import { useWatchlist } from "./store/watchlistStore";
import Profile from "./pages/Profile";
import MovieDetails from "./pages/MovieDetails";

function App() {
  const token = useAuthStore((state) => state.token);
  const fetchWatchlist = useWatchlist((state) => state.fetchWatchlist);
  const clearWatchlist = useWatchlist((state) => state.clearWatchlist);

  useEffect(() => {
    if (token) {
      fetchWatchlist();
    } else {
      clearWatchlist();
    }
  }, [token, fetchWatchlist, clearWatchlist]);

  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <div className="p-4">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/watchlist"
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/movie/:imdbID"
              element={
                <ProtectedRoute>
                  <MovieDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
