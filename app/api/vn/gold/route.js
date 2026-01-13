import vnPrices from '@/data/vn-prices.json';
import { normalize } from '@/lib/normalize';

export async function GET() {
  try {
    const goldData = {
      updatedAt: vnPrices.updatedAt,
      unit: vnPrices.gold.unit,
      items: vnPrices.gold.items,
      note: vnPrices.gold.note
    };
    return Response.json(normalize.success(goldData, { source: 'manual', cached: true, ttl: 86400 }));
  } catch (error) {
    console.error('[API/VN/GOLD] Error:', error?.message);
    return Response.json({ ok: false, error: 'Failed to load VN gold data', lastUpdated: null }, { status: 200 });
  }
}
