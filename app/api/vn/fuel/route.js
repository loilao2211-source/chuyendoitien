import { normalize } from '@/lib/normalize';
import { fetchVnFuelPrices } from '@/services/vnFuelService';

export async function GET() {
  try {
    const fuelData = await fetchVnFuelPrices();
    return Response.json(
      normalize.success(fuelData, {
        source: fuelData.source,
        cached: true,
        ttl: 1800,
      })
    );
  } catch (error) {
    console.error('[API/VN/FUEL] Error:', error?.message);
    return Response.json({ ok: false, error: 'Failed to load VN fuel data', lastUpdated: null }, { status: 200 });
  }
}
