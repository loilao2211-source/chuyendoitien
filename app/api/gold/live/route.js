import { NextResponse } from 'next/server';
import { fetchGoldQuote } from '@/services/goldService';

export async function GET() {
  try {
    const quote = await fetchGoldQuote();

    return NextResponse.json({
      ok: true,
      price: quote.xauUsd,
      source: quote.source,
      sourceType: quote.sourceType,
      isEstimated: quote.isEstimated,
      timestamp: quote.updatedAt,
      unit: quote.unit || 'USD_per_troy_oz',
      ...(quote.note ? { note: quote.note } : {}),
      data: quote,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error.message || 'Failed to fetch gold price',
      },
      { status: 502 }
    );
  }
}
