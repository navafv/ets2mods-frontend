export default function PasswordStrength({ password }) {
  const rules = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const score = rules.filter(Boolean).length;

  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 w-full rounded ${
              score > i ? colors[score - 1] : "bg-gray-700"
            }`}
          />
        ))}
      </div>
      <p className="text-xs mt-1 text-gray-400">
        {score < 2 && "Weak"}
        {score === 2 && "Medium"}
        {score === 3 && "Strong"}
        {score === 4 && "Very strong"}
      </p>
    </div>
  );
}
