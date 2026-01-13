import { NextResponse } from 'next/server';
import { fetchHistoricalOil } from '@/services/oilService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'brent';
    const days = parseInt(searchParams.get('days') || '30', 10);

    const data = await fetchHistoricalOil(type, days);

    return NextResponse.json(
      {
        ok: true,
        data,
        type,
        days,
        note: 'Historical oil data is approximated. For accurate data, register for EIA API key.',
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=10800, stale-while-revalidate=10800',
        },
      }
    );
  } catch (error) {
    console.error('[API /api/oil/historical] Error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch historical oil data',
      },
      { status: 500 }
    );
  }
}
