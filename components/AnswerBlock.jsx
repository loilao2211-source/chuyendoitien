/**
 * AnswerBlock Component
 * Critical for AI citation - must be visible and clear
 * Provides direct answer to search query
 */

export default function AnswerBlock({ children, lastUpdated }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-indigo-500 rounded-lg p-6 mb-8 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          ✓
        </div>
        <div className="flex-1">
          <p className="text-lg leading-relaxed text-gray-800 font-medium">
            {children}
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-600 mt-3 flex items-center gap-2">
              <span className="text-indigo-600">🕐</span>
              Cập nhật lần cuối: {lastUpdated} (GMT+7)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
