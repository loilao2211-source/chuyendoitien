/**
 * FAQSection Component
 * Optimized for search intent (not tool usage)
 * Each FAQ must be unique per page
 */

export default function FAQSection({ faqs }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <span className="text-3xl">❓</span>
        Câu hỏi thường gặp
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-2">
              <span className="text-indigo-600 flex-shrink-0">Q{index + 1}:</span>
              <span>{faq.question}</span>
            </h3>
            <div className="pl-8 text-gray-700 leading-relaxed">
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
