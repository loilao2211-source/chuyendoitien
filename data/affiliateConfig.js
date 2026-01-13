/**
 * Affiliate Configuration by Category
 * Mỗi category có danh sách affiliate phù hợp với ngữ cảnh trang
 * 
 * UTM params tự động thêm vào links: ?utm_source=priceconverter&utm_page={category}
 */

/**
 * Add UTM params to affiliate link
 * @param {string} href - Original link
 * @param {string} category - Category name (money_transfer, crypto, gold, fuel)
 * @returns {string} Link with UTM params
 */
export function addUTMParams(href, category) {
  if (!href || href === '#') return href;

  // Support both absolute (https://...) and relative (/go/wise) links
  const isRelative = href.startsWith('/');
  const base = 'http://localhost'; // dummy base for URL parsing

  try {
    const url = new URL(href, isRelative ? base : undefined);
    url.searchParams.set('utm_source', 'priceconverter');
    url.searchParams.set('utm_page', category);
    url.searchParams.set('utm_medium', 'affiliate');

    // Keep relative output if input was relative
    return isRelative ? url.pathname + url.search + url.hash : url.toString();
  } catch (err) {
    console.warn('[affiliateConfig] addUTMParams parse error:', err);
    return href; // fail-safe: return original
  }
}

export const affiliateConfig = {
  // A) Chuyển tiền / Tiền tệ (Currency page)
  money_transfer: [
    {
      id: 'wise',
      name: 'Wise',
      description: 'Chuyển tiền quốc tế phí thấp',
      fee: '~0.6–1%',
      cta: 'Xem phí',
      href: '/go/wise',
      outboundHref: 'https://wise.com/',
      badge: 'Phổ biến',
      icon: '💸',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Thanh toán trực tuyến toàn cầu',
      fee: '~3–4%',
      cta: 'Xem phí',
      href: '/go/paypal',
      outboundHref: 'https://www.paypal.com/us/webapps/mpp/home',
      badge: null,
      icon: '💳',
    },
  ],

  // B) Crypto (Cryptocurrency page)
  crypto: [
    {
      id: 'crypto-exchange',
      name: 'Sàn giao dịch crypto',
      description: 'Mua, bán và giao dịch cryptocurrency',
      fee: 'Phí giao dịch từ 0.1%',
      cta: 'Mở tài khoản',
      href: '/go/crypto-exchange',
      outboundHref: '#',
      badge: 'Tham khảo',
      icon: '🏦',
    },
    {
      id: 'crypto-wallet',
      name: 'Ví lưu trữ crypto',
      description: 'Bảo quản tài sản số an toàn',
      fee: 'Miễn phí tải về',
      cta: 'Tải ví',
      href: '/go/crypto-wallet',
      outboundHref: '#',
      badge: null,
      icon: '🔐',
    },
    {
      id: 'crypto-onramp',
      name: 'Mua crypto bằng thẻ',
      description: 'Nạp tiền fiat trực tiếp mua crypto',
      fee: 'Phí từ 2-4%',
      cta: 'Mua crypto',
      href: '/go/crypto-onramp',
      outboundHref: '#',
      badge: null,
      icon: '💰',
    },
    {
      id: 'crypto-tracker',
      name: 'Theo dõi danh mục',
      description: 'Quản lý và theo dõi portfolio crypto',
      fee: 'Miễn phí',
      cta: 'Xem chi tiết',
      href: '/go/crypto-tracker',
      outboundHref: '#',
      badge: null,
      icon: '📊',
    },
  ],

  // C) Gold (Vàng page)
  gold: [
    {
      id: 'gold-purchase',
      name: 'Mua vàng miếng / nhẫn',
      description: 'So sánh giá vàng từ các thương hiệu uy tín',
      fee: 'Giá niêm yết + phí',
      cta: 'Xem giá',
      href: '/go/gold-purchase',
      outboundHref: '#',
      badge: 'Tham khảo',
      icon: '🏅',
    },
    {
      id: 'gold-tracker',
      name: 'Theo dõi giá vàng',
      description: 'Nhận thông báo khi giá vàng thay đổi',
      fee: 'Miễn phí',
      cta: 'Xem app',
      href: '/go/gold-tracker',
      outboundHref: '#',
      badge: null,
      icon: '📱',
    },
    {
      id: 'gold-compare',
      name: 'So sánh giá thương hiệu',
      description: 'So sánh giá mua/bán từ SJC, PNJ, DOJI',
      fee: 'Miễn phí tra cứu',
      cta: 'So sánh',
      href: '/go/gold-compare',
      outboundHref: '#',
      badge: null,
      icon: '⚖️',
    },
  ],

  // D) Fuel/Oil (Xăng dầu page)
  fuel: [
    {
      id: 'fuel-map',
      name: 'Tìm cây xăng gần bạn',
      description: 'Bản đồ cây xăng và giá nhiên liệu',
      fee: 'Miễn phí',
      cta: 'Mở bản đồ',
      href: '/go/fuel-map',
      outboundHref: '#',
      badge: 'Tiện ích',
      icon: '🗺️',
    },
    {
      id: 'fuel-tracker',
      name: 'Theo dõi giá nhiên liệu',
      description: 'Ứng dụng cập nhật giá xăng dầu theo khu vực',
      fee: 'Miễn phí',
      cta: 'Xem giá',
      href: '/go/fuel-tracker',
      outboundHref: '#',
      badge: null,
      icon: '📊',
    },
    {
      id: 'fuel-card',
      name: 'Thẻ ưu đãi mua xăng',
      description: 'Hoàn tiền và tích điểm khi mua nhiên liệu',
      fee: 'Miễn phí đăng ký',
      cta: 'Đăng ký',
      href: '/go/fuel-card',
      outboundHref: '#',
      badge: null,
      icon: '💳',
    },
  ],
};

/**
 * Get affiliate list by category
 */
export function getAffiliatesByCategory(category) {
  return affiliateConfig[category] || [];
}

/**
 * Find affiliate by id across all categories
 */
export function findAffiliateById(id) {
  if (!id) return null;
  for (const [category, items] of Object.entries(affiliateConfig)) {
    const found = items.find((item) => item.id === id);
    if (found) return { ...found, category };
  }
  return null;
}

/**
 * Category metadata
 */
export const categoryMeta = {
  money_transfer: {
    title: 'Transfer options',
    subtitle: 'Dịch vụ chuyển tiền quốc tế',
    disclaimer: 'Liên kết giới thiệu — có thể nhận hoa hồng, không tăng chi phí cho bạn.',
  },
  crypto: {
    title: 'Crypto Services',
    subtitle: 'Dịch vụ và công cụ cryptocurrency',
    disclaimer: 'Liên kết giới thiệu — có thể nhận hoa hồng. Crypto có rủi ro cao, hãy tìm hiểu kỹ trước khi đầu tư.',
  },
  gold: {
    title: 'Gold Services',
    subtitle: 'Dịch vụ mua bán và theo dõi vàng',
    disclaimer: 'Liên kết giới thiệu — có thể nhận hoa hồng, không tăng chi phí cho bạn.',
  },
  fuel: {
    title: 'Fuel Services',
    subtitle: 'Công cụ tra cứu và tiết kiệm xăng dầu',
    disclaimer: 'Liên kết giới thiệu — có thể nhận hoa hồng, không tăng chi phí cho bạn.',
  },
  interest: {
    title: 'Interest Tools',
    subtitle: 'So sánh tiết kiệm, lãi suất ngân hàng',
    disclaimer: 'Thông tin tham khảo, không phải lời khuyên tài chính. Có thể nhận hoa hồng từ liên kết giới thiệu.',
  },
};
