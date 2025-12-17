import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: true,
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      await login(
        form.username,
        form.password,
        form.remember
      );
      navigate("/");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-card p-6 rounded border border-gray-800"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login
        </h1>

        {error && (
          <div className="mb-4 text-red-400 bg-black p-3 rounded border border-red-800">
            {error}
          </div>
        )}

        <input
          placeholder="Username"
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 bg-black border border-gray-700 rounded"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* Remember Me */}
        <label className="flex items-center gap-2 text-sm mb-4">
          <input
            type="checkbox"
            checked={form.remember}
            onChange={(e) =>
              setForm({ ...form, remember: e.target.checked })
            }
          />
          Remember me
        </label>

        <button
          disabled={submitting}
          className="w-full bg-primary py-2 rounded font-semibold"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forgot-password" className="text-primary">
            Forgot password?
          </Link>
          <Link to="/register" className="text-primary">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
