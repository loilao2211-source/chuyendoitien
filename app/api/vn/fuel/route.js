import vnPrices from '@/data/vn-prices.json';
import { normalize } from '@/lib/normalize';

export async function GET() {
  try {
    const fuelData = {
      updatedAt: vnPrices.updatedAt,
      unit: vnPrices.fuel.unit,
      regions: vnPrices.fuel.regions,
      items: vnPrices.fuel.items,
      note: vnPrices.fuel.note
    };
    return Response.json(normalize.success(fuelData, { source: 'manual', cached: true, ttl: 86400 }));
  } catch (error) {
    console.error('[API/VN/FUEL] Error:', error?.message);
    return Response.json({ ok: false, error: 'Failed to load VN fuel data', lastUpdated: null }, { status: 200 });
  }
}
