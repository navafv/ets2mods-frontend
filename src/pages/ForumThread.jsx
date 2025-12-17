import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import SEO from "../components/SEO";

export default function ForumThread() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    api
      .get(`forums/posts/?thread_slug=${slug}`)
      .then((res) => setPosts(res.data));
  }, [slug]);

  const submit = async () => {
    await api.post("forums/posts/", {
      content,
      thread_id: posts[0]?.thread,
      parent: replyTo,
    });
    window.location.reload();
  };

  const toggleLike = async (id) => {
    await api.post(`forums/posts/${id}/like/`);
    window.location.reload();
  };

  return (
    <div>
      <SEO
        title="ETS2 Mods – Best Euro Truck Simulator 2 Mods"
        description="Download the best ETS2 mods, trucks, maps and trailers"
      />
      <h1 className="text-2xl font-bold mb-6">Thread</h1>

      {posts.map((p) => (
        <div
          key={p.id}
          style={{ marginLeft: `${p.level * 20}px` }}
          className="bg-card p-4 mb-3 rounded border border-gray-800"
        >
          <p className="text-sm text-gray-400">{p.author_name}</p>
          <p className="mt-1">{p.content}</p>

          <div className="flex gap-4 mt-2 text-sm">
            <button
              onClick={() => toggleLike(p.id)}
              className={p.is_liked ? "text-blue-400" : "text-gray-400"}
            >
              👍 {p.like_count}
            </button>

            <button onClick={() => setReplyTo(p.id)} className="text-blue-400">
              Reply
            </button>
          </div>
        </div>
      ))}

      <textarea
        placeholder="Write reply..."
        className="w-full p-3 bg-black border border-gray-700 mt-4"
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={submit} className="mt-3 bg-primary px-4 py-2 rounded">
        Post Reply
      </button>
    </div>
  );
}
