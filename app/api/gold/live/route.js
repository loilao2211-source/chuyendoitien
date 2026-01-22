// Live Gold Price API - Free alternatives aggregator
// Tries multiple free sources to get most accurate XAU/USD price

import { NextResponse } from 'next/server';

const FALLBACK_PRICE = 4865.26; // Current as of Jan 21, 2026

export async function GET() {
  try {
    // Try multiple free sources in order of preference
    
    // 1. Try metals-api.com free tier (limited calls)
    try {
      const res1 = await fetch(
        'https://metals-api.com/api/latest?access_key=demo&base=USD&symbols=XAU',
        { 
          cache: 'no-store',
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(5000) 
        }
      );
      
      if (res1.ok) {
        const data = await res1.json();
        if (data.success && data.rates?.XAU) {
          // Invert if needed (API returns USD per XAU, we need XAU per USD)
          const price = data.rates.XAU < 1 ? 1 / data.rates.XAU : data.rates.XAU;
          
          if (price >= 500 && price <= 20000) {
            return NextResponse.json({
              ok: true,
              price,
              source: 'metals-api-free',
              timestamp: new Date().toISOString(),
              unit: 'USD_per_troy_oz',
            });
          }
        }
      }
    } catch (err) {
      console.log('[Gold Live API] metals-api failed:', err.message);
    }

    // 2. Try alternative: commodities-api.com
    try {
      const res2 = await fetch(
        'https://commodities-api.com/api/latest?access_key=demo&base=USD&symbols=XAU',
        { 
          cache: 'no-store',
          next: { revalidate: 300 },
          signal: AbortSignal.timeout(5000) 
        }
      );
      
      if (res2.ok) {
        const data = await res2.json();
        if (data.success && data.data?.rates?.XAU) {
          const price = data.data.rates.XAU < 1 ? 1 / data.data.rates.XAU : data.data.rates.XAU;
          
          if (price >= 500 && price <= 20000) {
            return NextResponse.json({
              ok: true,
              price,
              source: 'commodities-api',
              timestamp: new Date().toISOString(),
              unit: 'USD_per_troy_oz',
            });
          }
        }
      }
    } catch (err) {
      console.log('[Gold Live API] commodities-api failed:', err.message);
    }

    // 3. Fallback to current market price
    console.warn('[Gold Live API] All sources failed, using fallback');
    return NextResponse.json({
      ok: true,
      price: FALLBACK_PRICE,
      source: 'fallback-current',
      timestamp: new Date().toISOString(),
      unit: 'USD_per_troy_oz',
      note: 'Using cached market price, may not be real-time',
    });

  } catch (error) {
    console.error('[Gold Live API] Fatal error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to fetch gold price',
        price: FALLBACK_PRICE,
        source: 'fallback-error',
      },
      { status: 500 }
    );
  }
}
