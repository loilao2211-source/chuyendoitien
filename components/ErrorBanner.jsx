"use client";

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="max-w-5xl mx-auto w-full glass-panel border border-red-200 text-red-700 rounded-2xl p-4 text-sm flex items-center gap-2">
      <span role="img" aria-label="warning">⚠️</span>
      <span>{message}</span>
    </div>
  );
}
