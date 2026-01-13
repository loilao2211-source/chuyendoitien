'use client';

export default function Disclaimer() {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
      <p className="text-sm text-yellow-800">
        <strong>⚠️ Disclaimer:</strong> This tool provides indicative rates for
        informational purposes only. Prices are sourced from third-party APIs and
        may have a delay. For financial transactions, always use official banking
        or exchange platforms. We are not responsible for any losses resulting
        from the use of this tool.
      </p>
    </div>
  );
}
