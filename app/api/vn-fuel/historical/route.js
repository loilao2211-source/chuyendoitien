import { NextResponse } from 'next/server';
import { getCache, setCache } from '@/services/cache';
import vnPrices from '@/data/vn-prices.json';

const vnFuelData = {
  items: vnPrices.fuel.items,
  updatedAt: vnPrices.updatedAt
};

/**
 * Generate historical VN fuel prices (approximated)
 * Since we don't have real historical data, we create synthetic data
 * based on current prices with realistic fluctuations
 */
function generateVnFuelHistorical(fuelCode, days) {
  const currentItem = vnFuelData.items.find(item => 
    item.code.toLowerCase() === fuelCode.toLowerCase()
  );
  
  if (!currentItem) {
    throw new Error(`Fuel ${fuelCode} not found`);
  }
  
  // Use average of region1 and region2 as current price
  const currentPrice = (currentItem.region1 + currentItem.region2) / 2;
  
  const data = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add realistic variance (±3% fluctuation for fuel prices)
    const variance = 0.97 + Math.random() * 0.06;
    const price = currentPrice * variance;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price),
    });
  }
  
  return data;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fuel = searchParams.get('fuel') || 'e5-ron92';
    const days = parseInt(searchParams.get('days') || '30', 10);

    const cacheKey = `vn-fuel-historical-${fuel}-${days}d`;
    const cached = getCache(cacheKey);
    
    if (cached) {
      return NextResponse.json(
        {
          ok: true,
          data: cached,
          fuel,
          days,
          note: 'VN fuel historical data is approximated. Prices are in VND per liter.',
        },
        {
          headers: {
            'Cache-Control': 'public, max-age=300, s-maxage=10800, stale-while-revalidate=10800',
          },
        }
      );
    }

    const data = generateVnFuelHistorical(fuel, days);
    
    setCache(cacheKey, data, 2 * 60 * 60 * 1000); // 2 hours

    return NextResponse.json(
      {
        ok: true,
        data,
        fuel,
        days,
        note: 'VN fuel historical data is approximated. Prices are in VND per liter.',
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=10800, stale-while-revalidate=10800',
        },
      }
    );
  } catch (error) {
    console.error('[API /api/vn-fuel/historical] Error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch VN fuel historical data',
      },
      { status: 500 }
    );
  }
}
