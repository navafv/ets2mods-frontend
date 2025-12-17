import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Notifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("users/notifications/").then(res => setItems(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {items.map(n => (
        <Link
          key={n.id}
          to={n.link}
          className={`block p-3 mb-2 rounded border ${
            n.is_read ? "border-gray-800" : "border-blue-500"
          }`}
        >
          {n.message}
        </Link>
      ))}
    </div>
  );
}
