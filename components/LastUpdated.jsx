'use client';

export default function LastUpdated({ timestamp }) {
  if (!timestamp) return null;

  const date = new Date(timestamp);
  const formatted = date.toLocaleString();

  return (
    <p className="text-sm text-gray-500 text-center mt-2">
      Last updated: {formatted}
    </p>
  );
}
