import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("users/me/").then(res => setUser(res.data));
  }, []);

  const saveProfile = async () => {
    await api.patch("users/me/", {
      username: user.username,
      email: user.email,
    });
    setMessage("Profile updated");
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    await api.post("auth/change-password/", {
      old_password: form.get("old"),
      new_password: form.get("new"),
    });

    setMessage("Password changed");
  };

  if (!user) return <p>Loading…</p>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      {message && <p className="text-green-400 mb-4">{message}</p>}

      <input
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
      />

      <input
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        className="w-full mb-4 p-2 bg-black border border-gray-700 rounded"
      />

      <button onClick={saveProfile} className="bg-primary px-4 py-2 rounded">
        Save Profile
      </button>

      <form onSubmit={changePassword} className="mt-8">
        <h2 className="font-semibold mb-2">Change Password</h2>
        <input
          name="old"
          type="password"
          placeholder="Current password"
          className="w-full mb-2 p-2 bg-black border border-gray-700 rounded"
        />
        <input
          name="new"
          type="password"
          placeholder="New password"
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
        />
        <button className="bg-primary px-4 py-2 rounded">
          Update Password
        </button>
      </form>
    </div>
  );
}
