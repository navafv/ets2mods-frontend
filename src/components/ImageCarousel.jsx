import { useState } from "react";

export default function ImageCarousel({ images }) {
  const [index, setIndex] = useState(0);

  if (!images?.length) return null;

  return (
    <div className="relative">
      <img
        src={images[index].image_url}
        className="rounded border border-gray-800 w-full max-h-96 object-cover"
      />

      <button
        onClick={() => setIndex((index - 1 + images.length) % images.length)}
        className="absolute left-2 top-1/2 bg-black px-3 py-1"
      >
        ‹
      </button>

      <button
        onClick={() => setIndex((index + 1) % images.length)}
        className="absolute right-2 top-1/2 bg-black px-3 py-1"
      >
        ›
      </button>
    </div>
  );
}
