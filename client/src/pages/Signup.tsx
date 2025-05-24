import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(username, email, password);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert("Signup failed: " + err);
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="flex flex-col gap-4 max-w-md mx-auto mt-20"
    >
      <h2 className="text-2xl font-bold text-center">Sign Up</h2>
      <Input
        className="p-2 border rounded"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
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
        className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        Sign Up
      </Button>
    </form>
  );
}
