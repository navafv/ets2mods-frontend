export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-card p-4 rounded border border-gray-800">
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-5/6"></div>
    </div>
  );
}
