import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ImageCarousel from "../components/ImageCarousel";
import CompatibilityChecker from "../components/CompatibilityChecker";
import SEO from "../components/SEO";

export default function ModDetail() {
  const { id } = useParams();
  const [mod, setMod] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get(`mods/${id}/`).then((res) => setMod(res.data));
    api.get(`reviews/?mod_id=${id}`).then((res) => setReviews(res.data));
  }, [id]);

  if (!mod) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <SEO
        title="ETS2 Mods – Best Euro Truck Simulator 2 Mods"
        description="Download the best ETS2 mods, trucks, maps and trailers"
      />
      <h1 className="text-2xl font-bold">{mod.title}</h1>
      <ImageCarousel images={mod.screenshots} />
      <CompatibilityChecker modId={id} />
      <p>{mod.description}</p>

      <h2 className="text-xl font-semibold">Reviews</h2>

      {reviews.map((r) => (
        <div key={r.id} className="bg-black p-3 rounded border border-gray-700">
          <strong>{r.user_username}</strong>
          <p>⭐ {r.rating}</p>
          <p>{r.content}</p>
        </div>
      ))}
    </div>
  );
}
