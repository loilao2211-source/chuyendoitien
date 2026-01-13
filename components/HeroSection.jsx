export default function HeroSection({
  title,
  subtitle,
  badgeLeft,
  badgeRight,
  children,
  variant = 'light',
}) {
  const variantClasses = {
    light: 'bg-gradient-to-r from-white via-sky-50 to-emerald-50 border border-gray-200',
  };

  return (
    <section className={`relative overflow-hidden rounded-2xl px-6 py-6 shadow-sm ${variantClasses[variant] || variantClasses.light}`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-sky-100 opacity-60" aria-hidden="true" />
        <div className="absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-emerald-100 opacity-50" aria-hidden="true" />
      </div>
      <div className="relative space-y-3">
        <div className="flex flex-wrap justify-between items-center gap-2 text-xs font-semibold text-sky-800">
          {badgeLeft && <span className="px-3 py-1 rounded-full bg-white/80 border border-sky-100 text-sky-700">{badgeLeft}</span>}
          {badgeRight && <span className="px-3 py-1 rounded-full bg-white/80 border border-emerald-100 text-emerald-700">{badgeRight}</span>}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm md:text-base text-gray-700 max-w-3xl">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
