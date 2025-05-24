import { useState } from "react";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      setToken(data.token);
      navigate("/watchlist");
    } catch (err) {
      alert("Login failed. Check your credentials." + err);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-4 max-w-md mx-auto mt-20"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <Input
        className="p-2 border rounded"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <Input
        className="p-2 border rounded"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <Button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Login
      </Button>
    </form>
  );
}
