import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import PasswordStrength from "../components/PasswordStrength";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("auth/register/", form);
      navigate("/login");
    } catch {
      setError("Registration failed. Try different credentials.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form
        onSubmit={submit}
        className="max-w-md w-full bg-card p-6 rounded border border-gray-800"
      >
        <h1 className="text-xl font-bold mb-6">Register</h1>

        {error && <div className="mb-4 text-red-400">{error}</div>}

        <input
          placeholder="Username"
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-2 p-2 bg-black border border-gray-700 rounded"
        />

        <PasswordStrength password={form.password} />

        <button className="w-full bg-primary py-2 rounded">Register</button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
