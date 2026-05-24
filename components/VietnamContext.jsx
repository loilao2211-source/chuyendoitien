/**
 * VietnamContext Component
 * Emphasizes Vietnam-specific relevance for GEO
 */

export default function VietnamContext({ children, icon = "🇻🇳" }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mt-6">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1 text-gray-800 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
