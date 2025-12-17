import { Star } from "lucide-react";

export default function StarRating({ rating, setRating, readOnly = false, size = 16 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && setRating(star)}
          className={`${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110 transition"}`}
          disabled={readOnly}
        >
          <Star 
            size={size} 
            className={`${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "fill-slate-100 text-slate-300"
            }`} 
          />
        </button>
      ))}
    </div>
  );
}