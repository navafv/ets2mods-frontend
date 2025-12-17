import { useEffect, useState } from "react";
import api from "../api/axios";
import SEO from "../components/SEO";

export default function Forums() {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    api.get("forums/threads/").then((res) => setThreads(res.data));
  }, []);

  return (
    <div>
      <SEO
        title="ETS2 Mods – Best Euro Truck Simulator 2 Mods"
        description="Download the best ETS2 mods, trucks, maps and trailers"
      />
      <h1 className="text-3xl font-bold mb-6">Forums</h1>

      {threads.map((t) => (
        <div key={t.id} className="bg-card p-4 mb-4 rounded">
          <h2 className="font-semibold">{t.title}</h2>
          <p className="text-sm text-gray-400">
            By {t.author_name} | {t.post_count} replies
          </p>
        </div>
      ))}
    </div>
  );
}
