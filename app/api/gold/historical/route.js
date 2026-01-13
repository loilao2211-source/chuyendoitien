import { NextResponse } from 'next/server';
import { fetchHistoricalGold } from '@/services/goldService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    const data = await fetchHistoricalGold(days);

    return NextResponse.json(
      {
        ok: true,
        data,
        days,
        note: 'Historical gold data is approximated. For accurate data, use a paid API service.',
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=10800, stale-while-revalidate=10800',
        },
      }
    );
  } catch (error) {
    console.error('[API /api/gold/historical] Error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch historical gold data',
      },
      { status: 500 }
    );
  }
}
