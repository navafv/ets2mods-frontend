import { useState } from "react";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("auth/password-reset/", { email });
    setSent(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form
        onSubmit={submit}
        className="max-w-md w-full bg-card p-6 rounded border border-gray-800"
      >
        <h1 className="text-xl font-bold mb-4">
          Reset Password
        </h1>

        {sent ? (
          <p className="text-green-400">
            Password reset email sent.
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="Your email"
              required
              className="w-full p-2 bg-black border border-gray-700 rounded mb-4"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="bg-primary w-full py-2 rounded">
              Send Reset Link
            </button>
          </>
        )}
      </form>
    </div>
  );
}
