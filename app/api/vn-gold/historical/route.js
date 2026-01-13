import { NextResponse } from 'next/server';
import { getCache, setCache } from '@/services/cache';
import vnPrices from '@/data/vn-prices.json';

const vnGoldData = {
  items: vnPrices.gold.items,
  updatedAt: vnPrices.updatedAt
};

/**
 * Generate historical VN gold prices (approximated)
 * Since we don't have real historical data, we create synthetic data
 * based on current prices with realistic fluctuations
 */
function generateVnGoldHistorical(brand, days) {
  const currentItem = vnGoldData.items.find(item => 
    item.brand.toLowerCase().includes(brand.toLowerCase())
  );
  
  if (!currentItem) {
    throw new Error(`Brand ${brand} not found`);
  }
  
  // Use average of buy/sell as current price
  const currentPrice = (currentItem.buy + currentItem.sell) / 2;
  
  const data = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add realistic variance (±1.5% fluctuation for gold)
    const variance = 0.985 + Math.random() * 0.03;
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
    const brand = searchParams.get('brand') || 'sjc';
    const days = parseInt(searchParams.get('days') || '30', 10);

    const cacheKey = `vn-gold-historical-${brand}-${days}d`;
    const cached = getCache(cacheKey);
    
    if (cached) {
      return NextResponse.json(
        {
          ok: true,
          data: cached,
          brand,
          days,
          note: 'VN gold historical data is approximated. Prices are in VND per lượng (37.5g).',
        },
        {
          headers: {
            'Cache-Control': 'public, max-age=300, s-maxage=10800, stale-while-revalidate=10800',
          },
        }
      );
    }

    const data = generateVnGoldHistorical(brand, days);
    
    setCache(cacheKey, data, 2 * 60 * 60 * 1000); // 2 hours

    return NextResponse.json(
      {
        ok: true,
        data,
        brand,
        days,
        note: 'VN gold historical data is approximated. Prices are in VND per lượng (37.5g).',
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=10800, stale-while-revalidate=10800',
        },
      }
    );
  } catch (error) {
    console.error('[API /api/vn-gold/historical] Error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch VN gold historical data',
      },
      { status: 500 }
    );
  }
}
