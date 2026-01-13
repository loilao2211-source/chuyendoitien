"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BackLink({ href = "/", label = "Quay lại" }) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-gray-200 text-sm font-semibold text-gray-700 shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition"
    >
      <span aria-hidden>←</span>
      {label}
    </button>
  );
}
