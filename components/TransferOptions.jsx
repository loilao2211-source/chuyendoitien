'use client';

import TransferOptionsTable from './TransferOptionsTable';

export default function TransferOptions({ result }) {
  if (!result) return null;
  return (
    <TransferOptionsTable
      baseMoney={result.baseMoney || 'VND'}
      amount={result.amount}
      usdEquivalent={result.usd}
      resultsReady={!!result}
    />
  );
}
