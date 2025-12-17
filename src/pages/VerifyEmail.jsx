import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setStatus("invalid");
      return;
    }

    api.post("auth/verify-email/", { token })
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [params]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-card p-6 rounded border border-gray-800 text-center">
        {status === "verifying" && <p>Verifying email…</p>}
        {status === "success" && (
          <p className="text-green-400">Email verified successfully!</p>
        )}
        {status === "error" && (
          <p className="text-red-400">Verification failed.</p>
        )}
        {status === "invalid" && (
          <p className="text-red-400">Invalid verification link.</p>
        )}
      </div>
    </div>
  );
}
