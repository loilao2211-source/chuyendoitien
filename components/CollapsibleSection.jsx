"use client";

import { useState } from "react";

export default function CollapsibleSection({ title, defaultOpen = false, children, badge, id }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass-panel rounded-2xl border border-gray-100 max-w-5xl mx-auto" id={id}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50/50 transition-colors rounded-t-2xl"
      >
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">{title}</span>
          {badge && <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">{badge}</span>}
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
