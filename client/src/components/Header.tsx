import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useAuthStore } from "../store/authStore";

const Header = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-background text-foreground shadow p-4 flex gap-4 items-center">
      <Link to="/" className="text-primary font-semibold">
        Search
      </Link>
      <Link to="/watchlist" className="text-primary font-semibold">
        Watchlist
      </Link>

      <div className="ml-auto flex gap-4">
        <ThemeToggle />
        {!token ? (
          <>
            <Link to="/login" className="text-primary font-semibold">
              Login
            </Link>
            <Link to="/signup" className="text-primary font-semibold">
              Signup
            </Link>
          </>
        ) : (
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
          >
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Header;
