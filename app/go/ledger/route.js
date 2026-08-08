import { NextResponse } from 'next/server';

export async function GET() {
  const targetUrl = process.env.AFF_LEDGER_URL || 'https://ledger.com';

  return NextResponse.redirect(targetUrl, 302);
}
