import { NextResponse } from 'next/server';

export async function GET() {
  const targetUrl = process.env.AFF_TRUSTWALLET_URL || 'https://trustwallet.com';

  return NextResponse.redirect(targetUrl, 302);
}
