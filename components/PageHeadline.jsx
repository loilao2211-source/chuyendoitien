/**
 * PageHeadline Component
 * Hiển thị headline + subheadline ở đầu mỗi trang
 */

export default function PageHeadline({ title, subtitle, category = 'dashboard' }) {
  const accentColors = {
    dashboard: 'from-indigo-500 to-blue-500',
    currency: 'from-blue-500 to-cyan-500',
    crypto: 'from-orange-500 to-amber-500',
    gold: 'from-amber-500 to-yellow-500',
    oil: 'from-slate-600 to-gray-600',
  };

  const gradient = accentColors[category] || accentColors.dashboard;

  return (
    <div className="max-w-5xl mx-auto px-4 mb-6">
      <div className={`relative rounded-2xl bg-gradient-to-r ${gradient} text-white shadow-lg py-8 px-6 overflow-hidden`}>
        <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
        <div className="relative space-y-3 text-center">
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-sm">
            {title}
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
