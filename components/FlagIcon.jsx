import { currencyFlagMap } from '@/lib/flags';

const assetPathFor = (code) => `/flags/${code.toLowerCase()}.svg`;
const availableAssets = new Set(['USD', 'EUR', 'GBP', 'JPY', 'VND']);

export default function FlagIcon({ code, label, size = 20 }) {
  if (!code) return null;
  const upper = code.toUpperCase();
  const fallback = currencyFlagMap[upper] || '';
  const hasAsset = availableAssets.has(upper);
  const src = hasAsset ? assetPathFor(upper) : null;

  return (
    <span className="inline-flex items-center gap-2">
      {src ? (
        <img
          src={src}
          alt={`${upper} flag`}
          width={size}
          height={size}
          className="inline-block rounded-sm border border-gray-200 bg-white"
          onError={(e) => {
            if (fallback) {
              e.currentTarget.style.display = 'none';
              e.currentTarget.insertAdjacentText('afterend', fallback);
            }
          }}
        />
      ) : (
        <span>{fallback}</span>
      )}
      {label && <span>{label}</span>}
    </span>
  );
}
