import { NextResponse } from 'next/server';

export async function GET() {
  const targetUrl = process.env.AFF_COINSTATS_URL || 'https://coinstats.app';

  return NextResponse.redirect(targetUrl, 302);
}
