'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowDownLeft, ArrowRight, ArrowUpRight, CircleAlert, Egg, HandCoins, PackageCheck, Plus, Wallet } from 'lucide-react'

const summary = [
  { label: 'Total Stok', value: '1.240', unit: 'kg', Icon: PackageCheck, tone: 'bg-sky-50 text-[#1f4e79]' },
  { label: 'Titipan Beredar', value: '86', unit: 'butir', Icon: Egg, tone: 'bg-amber-50 text-amber-700' },
  { label: 'Piutang', value: 'Rp 2.450.000', unit: '', Icon: Wallet, tone: 'bg-rose-50 text-rose-700' },
  { label: 'Estimasi Laba Hari Ini', value: 'Rp 325.000', unit: '', Icon: HandCoins, tone: 'bg-emerald-50 text-emerald-700' },
]

const activity = [
  { title: 'Stok masuk', detail: 'Telur bebek mentah', amount: '+45 kg', time: '08.15', Icon: ArrowDownLeft, color: 'text-emerald-700' },
  { title: 'Titipan diterima', detail: 'Mitra: Bu Rina', amount: '30 butir', time: '09.40', Icon: ArrowUpRight, color: 'text-[#1f4e79]' },
]

export default function Home() {
  const [today, setToday] = useState('')

  useEffect(() => {
    setToday(new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date()))
  }, [])

  return (
    <main className="min-h-dvh px-5 pb-36 pt-7">
      <header className="mb-5 flex items-start justify-between">
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#1f4e79]">
            <span className="grid size-9 place-items-center rounded-xl bg-[#1f4e79] text-white"><Egg aria-hidden="true" size={19} /></span>
            BAKUL ENDOG
          </div>
          <h1 className="text-[25px] font-bold leading-tight tracking-normal text-zinc-900">Sugeng rawuh, Bakul!</h1>
            <p className="mt-1 text-sm capitalize text-zinc-500">{today || 'Ringkasan usaha hari ini'}</p>
            <span className="mt-2 inline-flex min-h-7 items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 text-xs font-semibold text-amber-800">
              Data contoh · belum terhubung
            </span>
        </div>
      </header>

      <section aria-labelledby="alert-title" className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700">
            <CircleAlert aria-hidden="true" size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="alert-title" className="font-bold text-zinc-900">Perlu Perhatian</h2>
            <p className="mt-1 text-sm leading-5 text-zinc-600">Titipan Pak Darto belum kembali dan piutang Bu Rina jatuh tempo hari ini.</p>
            <Link href="/mitra" className="mt-3 inline-flex min-h-12 items-center font-bold text-[#1f4e79]">Lihat tindak lanjut <span aria-hidden="true" className="ml-1">-&gt;</span></Link>
          </div>
        </div>
      </section>

      <section aria-label="Ringkasan usaha" className="grid grid-cols-2 gap-3">
        {summary.map(({ label, value, unit, Icon, tone }) => (
          <article key={label} className="min-h-36 rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200/70">
            <span className={`mb-3 grid size-9 place-items-center rounded-lg ${tone}`}><Icon aria-hidden="true" size={19} /></span>
            <p className="min-h-10 text-sm font-medium leading-5 text-zinc-500">{label}</p>
            <p className="mt-1 flex min-h-6 flex-wrap items-baseline gap-x-1 font-bold leading-tight text-zinc-900">
              <span className="text-base">{value}</span>
              {unit ? <span className="text-xs font-semibold text-zinc-500">{unit}</span> : null}
            </p>
          </article>
        ))}
      </section>

      <Link href="/proses" className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#1f4e79] px-5 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#193f62] active:bg-[#163653]">
        <Plus aria-hidden="true" size={20} strokeWidth={2.5} />
        Transaksi Cepat
      </Link>

      <section aria-label="Menu usaha" className="mt-5 grid grid-cols-2 gap-3">
        <Link href="/produk" className="flex min-h-12 items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 shadow-sm">
          Produk <ArrowRight aria-hidden="true" size={16} className="text-[#1f4e79]" />
        </Link>
        <Link href="/penjualan" className="flex min-h-12 items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 shadow-sm">
          Penjualan <ArrowRight aria-hidden="true" size={16} className="text-[#1f4e79]" />
        </Link>
      </section>

      <section className="mt-7" aria-labelledby="activity-title">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="activity-title" className="text-base font-bold text-zinc-900">Aktivitas Hari Ini</h2>
          <Link href="/laporan" className="flex min-h-12 items-center text-sm font-semibold text-[#1f4e79]">Semua</Link>
        </div>
        <div className="divide-y divide-zinc-100 rounded-xl bg-white px-4 shadow-sm ring-1 ring-zinc-200/70">
          {activity.map(({ title, detail, amount, time, Icon, color }) => (
            <div key={title} className="flex min-h-[68px] items-center gap-3 py-3">
              <span className={`grid size-9 shrink-0 place-items-center rounded-full bg-zinc-100 ${color}`}><Icon aria-hidden="true" size={18} /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-800">{title}</p>
                <p className="truncate text-[13px] text-zinc-500">{detail} <span aria-hidden="true">&middot;</span> {time}</p>
              </div>
              <p className="shrink-0 text-base font-bold text-zinc-900">{amount}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
