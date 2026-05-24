'use client';

import Link from 'next/link';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/currency', label: 'Tiền tệ' },
  { href: '/crypto', label: 'Crypto' },
  { href: '/gold', label: 'Vàng' },
  { href: '/oil', label: 'Dầu' },
  { href: '/blog', label: 'Blog' },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-white/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <span className="text-2xl">💱</span>
          <span>ChuyenDoiTien</span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex md:hidden items-center gap-2 text-sm text-gray-600">
          <span className="px-3 py-1 rounded-full bg-gray-100">Menu</span>
        </div>
      </div>
    </nav>
  );
}

