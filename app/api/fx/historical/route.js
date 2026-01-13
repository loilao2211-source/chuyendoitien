import { NextResponse } from 'next/server';
import { fetchHistoricalRates } from '@/services/fxService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from') || 'USD';
    const to = searchParams.get('to') || 'VND';
    const days = parseInt(searchParams.get('days') || '30', 10);

    const data = await fetchHistoricalRates(from, to, days);

    return NextResponse.json(
      {
        ok: true,
        data,
        from,
        to,
        days,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=10800, stale-while-revalidate=10800',
        },
      }
    );
  } catch (error) {
    console.error('[API /api/fx/historical] Error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch historical FX data',
      },
      { status: 500 }
    );
  }
}
