import { NextResponse } from 'next/server';
import { fetchHistoricalCrypto } from '@/services/cryptoService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || 'bitcoin';
    const days = parseInt(searchParams.get('days') || '30', 10);

    const data = await fetchHistoricalCrypto(id, days);

    return NextResponse.json(
      {
        ok: true,
        data,
        id,
        days,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=10800, stale-while-revalidate=10800',
        },
      }
    );
  } catch (error) {
    console.error('[API /api/crypto/historical] Error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch historical crypto data',
      },
      { status: 500 }
    );
  }
}
