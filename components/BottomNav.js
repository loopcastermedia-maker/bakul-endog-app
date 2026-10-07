'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChartNoAxesColumnIncreasing, ClipboardList, House, UsersRound, Warehouse } from 'lucide-react'

const items = [
  { href: '/', label: 'Beranda', Icon: House },
  { href: '/stok', label: 'Stok', Icon: Warehouse },
  { href: '/proses', label: 'Proses', Icon: ClipboardList },
  { href: '/mitra', label: 'Mitra', Icon: UsersRound },
  { href: '/laporan', label: 'Laporan', Icon: ChartNoAxesColumnIncreasing },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Navigasi utama" className="safe-bottom fixed bottom-0 left-1/2 z-50 grid w-full max-w-[480px] -translate-x-1/2 grid-cols-5 border-t border-zinc-200 bg-white/95 px-2 pt-2 shadow-[0_-4px_18px_rgba(24,24,27,0.06)] backdrop-blur">
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href))

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-semibold transition-colors ${active ? 'text-[#1f4e79]' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            <Icon aria-hidden="true" size={21} strokeWidth={active ? 2.4 : 1.9} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}