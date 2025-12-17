export default function Pagination({ page, total, pageSize, onPage }) {
  const pages = Math.ceil(total / pageSize);

  return (
    <div className="flex gap-2 mt-6 justify-center">
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i}
          onClick={() => onPage(i + 1)}
          className={`px-3 py-1 rounded ${
            page === i + 1
              ? "bg-blue-600"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
