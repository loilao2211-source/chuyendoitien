import { NextResponse } from 'next/server';

export async function GET() {
  const targetUrl = process.env.AFF_TREZOR_URL || 'https://trezor.io';

  return NextResponse.redirect(targetUrl, 302);
}
