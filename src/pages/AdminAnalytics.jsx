import { useEffect, useState } from "react";
import api from "../api/axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("analytics/admin/").then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading analytics...</p>;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Admin Analytics</h1>

      <Line
        data={{
          labels: data.downloads_per_day.map((d) => d.day),
          datasets: [
            {
              label: "Downloads",
              data: data.downloads_per_day.map((d) => d.count),
              borderColor: "var(--color-primary)",
            },
          ],
        }}
      />

      <Bar
        data={{
          labels: data.mods_by_category.map((c) => c.category__name),
          datasets: [
            {
              label: "Mods",
              data: data.mods_by_category.map((c) => c.count),
              backgroundColor: "#22c55e",
            },
          ],
        }}
      />
    </div>
  );
}
