import { normalize } from '@/lib/normalize';
import { fetchCompleteVnGold } from '@/services/vnGoldService';

export async function GET() {
  try {
    // Fetch from live aggregators with fallback to manual data
    const goldData = await fetchCompleteVnGold();
    
    return Response.json(
      normalize.success(goldData, { 
        source: goldData.source, 
        cached: true, 
        ttl: 600 // 10 minutes
      })
    );
  } catch (error) {
    console.error('[API/VN/GOLD] Error:', error?.message);
    return Response.json(
      { 
        ok: false, 
        error: 'Failed to load VN gold data', 
        lastUpdated: null 
      }, 
      { status: 200 }
    );
  }
}
