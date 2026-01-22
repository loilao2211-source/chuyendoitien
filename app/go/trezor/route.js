import { NextResponse } from 'next/server';

export async function GET() {
  const targetUrl = process.env.AFF_TREZOR_URL;

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'Missing AFF_TREZOR_URL environment variable' },
      { status: 500 }
    );
  }

  return NextResponse.redirect(targetUrl, 302);
}
