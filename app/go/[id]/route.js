import { NextResponse } from 'next/server';
import { findAffiliateById, addUTMParams } from '@/data/affiliateConfig';

const categoryRedirect = {
  money_transfer: '/currency',
  crypto: '/crypto',
  gold: '/gold',
  fuel: '/oil',
};

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const affiliate = findAffiliateById(id);

  // If not found or outbound missing -> coming soon
  if (!affiliate || !affiliate.outboundHref || affiliate.outboundHref === '#') {
    const fallback = affiliate ? categoryRedirect[affiliate.category] || '/' : '/';
    const url = new URL(fallback, request.url);
    url.searchParams.set('ref', 'coming_soon');
    return NextResponse.redirect(url.toString(), {
      status: 302,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const { outboundHref, category } = affiliate;
  const isExternal = outboundHref.startsWith('http://') || outboundHref.startsWith('https://');

  // Build target URL with UTM only for external links
  let target = outboundHref;
  if (isExternal) {
    target = addUTMParams(outboundHref, category);
  }

  // If target is relative (unlikely for outbound), resolve against site origin
  if (!isExternal && target.startsWith('/')) {
    const url = new URL(target, request.url);
    target = url.toString();
  }

  return NextResponse.redirect(target, {
    status: 302,
    headers: { 'Cache-Control': 'no-store' },
  });
}
