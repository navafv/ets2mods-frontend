import { useState } from "react";
import api from "../api/axios";

export default function CompatibilityChecker({ modId }) {
  const [result, setResult] = useState(null);
  const [gameVersion, setGameVersion] = useState("1.0");

  const check = async () => {
    const res = await api.post(
      `mods/${modId}/compatibility-check/`,
      { game_version: gameVersion, dlcs: [], installed_mods: [] }
    );
    setResult(res.data);
  };

  return (
    <div className="bg-black p-4 rounded border border-gray-700 mt-6">
      <h3 className="font-semibold mb-2">Compatibility Check</h3>

      <input
        value={gameVersion}
        onChange={e => setGameVersion(e.target.value)}
        className="p-2 bg-black border border-gray-600 mb-2"
        placeholder="Game version"
      />

      <button
        onClick={check}
        className="ml-2 bg-blue-600 px-4 py-1 rounded"
      >
        Check
      </button>

      {result && (
        <div className="mt-3">
          <p>Status: <b>{result.status}</b></p>
          {result.issues.map((i, idx) => (
            <p key={idx} className="text-red-400 text-sm">
              ⚠ {i.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
