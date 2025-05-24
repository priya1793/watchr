import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
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
        {!isAuthenticated ? (
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
            className="text-white-500 font-semibold"
          >
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Header;
