import { NextResponse } from 'next/server';

export async function GET() {
  const targetUrl = process.env.AFF_LEDGER_URL;

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'Missing AFF_LEDGER_URL environment variable' },
      { status: 500 }
    );
  }

  return NextResponse.redirect(targetUrl, 302);
}
