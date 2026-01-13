/**
 * Unified Theme System for PriceConverter
 * Light theme with category-specific accents
 */

export const theme = {
  // Base colors (light theme)
  base: {
    bg: 'bg-gradient-to-br from-blue-50 via-white to-indigo-50',
    card: 'bg-white/90',
    cardBorder: 'border-gray-200',
    text: 'text-gray-900',
    textMuted: 'text-gray-600',
    textLight: 'text-gray-500',
  },
  
  // Category-specific accents
  accents: {
    dashboard: {
      primary: 'indigo',
      gradient: 'from-indigo-500 to-blue-500',
      badge: 'bg-indigo-100 text-indigo-800',
      border: 'border-indigo-200',
      ring: 'ring-indigo-500',
    },
    currency: {
      primary: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'bg-blue-100 text-blue-800',
      border: 'border-blue-200',
      ring: 'ring-blue-500',
    },
    crypto: {
      primary: 'orange',
      gradient: 'from-orange-500 to-amber-500',
      badge: 'bg-orange-100 text-orange-800',
      border: 'border-orange-200',
      ring: 'ring-orange-500',
    },
    gold: {
      primary: 'amber',
      gradient: 'from-amber-500 to-yellow-500',
      badge: 'bg-amber-100 text-amber-800',
      border: 'border-amber-200',
      ring: 'ring-amber-500',
    },
    oil: {
      primary: 'slate',
      gradient: 'from-slate-600 to-gray-600',
      badge: 'bg-slate-100 text-slate-800',
      border: 'border-slate-200',
      ring: 'ring-slate-500',
    },
  },
  
  // Component styles
  components: {
    // Banner/Hero section (light with gradient)
    hero: (accent) => ({
      container: `relative max-w-5xl mx-auto text-center space-y-2 px-4 rounded-2xl bg-gradient-to-r ${accent.gradient} text-white shadow-lg py-6 overflow-hidden`,
      overlay: 'absolute inset-0 bg-white/10',
      badge: `text-xs uppercase tracking-[0.2em] font-semibold ${accent.badge.replace('bg-', 'text-').replace(/text-\w+-\d+/, 'text-white/90')}`,
      title: 'text-3xl font-bold drop-shadow-sm text-white',
      description: 'text-sm md:text-base text-white/90 max-w-3xl mx-auto',
      meta: 'flex flex-wrap justify-center gap-2 text-[11px] font-semibold text-white/80 pt-1',
      metaBadge: 'px-3 py-1 rounded-full bg-white/20',
    }),
    
    // Glass panel effect
    panel: 'bg-white/80 backdrop-blur-sm rounded-2xl p-6 border shadow-sm',
    
    // Card
    card: 'bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow',
  },
};

// Helper function to get theme for specific category
export function getTheme(category = 'dashboard') {
  const accent = theme.accents[category] || theme.accents.dashboard;
  return {
    ...theme.base,
    accent,
    hero: theme.components.hero(accent),
    panel: theme.components.panel,
    card: theme.components.card,
  };
}

// Headline component data
export const headlines = {
  dashboard: {
    title: 'Công cụ chuyển đổi giá trị đa năng',
    subtitle: 'Từ VND sang USD, vàng, dầu, crypto — chỉ 1 bước. Cập nhật 2 giờ/lần, đủ dùng cho tra cứu nhanh.',
  },
  currency: {
    title: 'Chuyển đổi tiền tệ thời gian thực',
    subtitle: 'Tỷ giá FX từ 50+ quốc gia. Công thức chuẩn, quy đổi chính xác từ VND, USD sang bất kỳ loại tiền nào.',
  },
  crypto: {
    title: 'Theo dõi & chuyển đổi tiền điện tử',
    subtitle: 'Bitcoin, Ethereum, 12+ đồng crypto phổ biến. Giá USD real-time, tính toán chéo giữa các coin dễ dàng.',
  },
  gold: {
    title: 'Giá vàng quốc tế & quy đổi đơn vị',
    subtitle: 'XAU/USD từ thị trường thế giới. Chuyển đổi ounce, gram, chỉ, cây — chuẩn cho người Việt.',
  },
  oil: {
    title: 'Giá dầu Brent & WTI trực tuyến',
    subtitle: 'Dầu thô quốc tế real-time. Quy đổi thùng, lít, gallon — đơn giản, nhanh chóng.',
  },
};
