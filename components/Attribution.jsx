'use client';

export default function Attribution() {
  return (
    <div className="bg-gray-100 p-4 text-center text-xs text-gray-600 rounded mt-6">
      <p>
        Data sources: <a href="https://frankfurter.app" className="text-blue-600 hover:underline">Frankfurter</a> |{' '}
        <a href="https://coingecko.com" className="text-blue-600 hover:underline">CoinGecko</a> |{' '}
        <a href="https://metals-api.com" className="text-blue-600 hover:underline">Metals API</a> |{' '}
        <a href="https://eia.gov" className="text-blue-600 hover:underline">EIA</a>
      </p>
    </div>
  );
}
