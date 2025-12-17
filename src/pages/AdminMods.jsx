import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminMods() {
  const [mods, setMods] = useState([]);

  useEffect(() => {
    api.get("mods/").then(res => setMods(res.data));
  }, []);

  const approve = async (id) => {
    await api.post(`mods/${id}/approve/`);
    setMods(prev => prev.filter(m => m.id !== id));
  };

  const reject = async (id) => {
    await api.patch(`mods/${id}/`, { status: "rejected" });
    setMods(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pending Mods</h1>

      {mods.filter(m => !m.is_approved).map(mod => (
        <div
          key={mod.id}
          className="bg-card p-4 mb-3 rounded"
        >
          <h2 className="font-semibold">{mod.title}</h2>

          <div className="mt-2 space-x-2">
            <button
              onClick={() => approve(mod.id)}
              className="bg-green-600 px-3 py-1 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => reject(mod.id)}
              className="bg-red-600 px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
