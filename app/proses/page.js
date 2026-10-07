import Link from 'next/link'
import { ArrowRight, PackagePlus, ShoppingCart } from 'lucide-react'
import PageShell from '../components/PageShell'

export default function ProsesPage() {
  return (
    <PageShell title="Transaksi Cepat" subtitle="Pilih aktivitas yang ingin dicatat.">
      <div className="grid gap-3">
        <Link href="/stok" className="flex min-h-16 items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><PackagePlus aria-hidden="true" size={20} /></span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold">Catat pergerakan stok</span>
            <span className="mt-1 block text-sm text-zinc-500">Stok masuk atau stok keluar</span>
          </span>
          <ArrowRight aria-hidden="true" size={18} className="shrink-0 text-[#1f4e79]" />
        </Link>
        <Link href="/penjualan" className="flex min-h-16 items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-sky-50 text-[#1f4e79]"><ShoppingCart aria-hidden="true" size={20} /></span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold">Hitung pembelian atau penjualan</span>
            <span className="mt-1 block text-sm text-zinc-500">Buka formulir transaksi harian</span>
          </span>
          <ArrowRight aria-hidden="true" size={18} className="shrink-0 text-[#1f4e79]" />
        </Link>
      </div>
    </PageShell>
  )
}