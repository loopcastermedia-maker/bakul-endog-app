'use client'

import { useEffect, useMemo, useState } from 'react'
import PageShell from '../components/PageShell'
import { getSupabaseStatusMessage, supabase } from '../../lib/supabase'

export default function DashboardPage() {
  const [produk, setProduk] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProduk() {
      try {
        const { data, error } = await supabase.from('master_produk').select('*').order('id', { ascending: true })
        if (!error) setProduk(data || [])
      } catch (error) {
        console.error('[dashboard] load failed', error)
      } finally {
        setLoading(false)
      }
    }

    loadProduk()
  }, [])

  const summary = useMemo(() => {
    const totalProduk = produk.length
    const kategoriSet = new Set(produk.map((item) => item.kategori || 'Lainnya'))
    const rataBiji = totalProduk
      ? Math.round(produk.reduce((sum, item) => sum + Number(item.biji_per_kg || 0), 0) / totalProduk)
      : 0

    return { totalProduk, totalKategori: kategoriSet.size, rataBiji }
  }, [produk])

  return (
    <PageShell title="Dashboard" subtitle="Ringkasan operasional Bakul Endog.">
      <div style={{ marginBottom: '18px', padding: '12px 14px', backgroundColor: '#ecfeff', borderRadius: '10px', border: '1px solid #a5f3fc' }}>
        <strong>Supabase status:</strong> {getSupabaseStatusMessage()}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px', marginBottom: '22px' }}>
        <StatCard label="Total Produk" value={summary.totalProduk} accent="#1d4ed8" />
        <StatCard label="Kategori" value={summary.totalKategori} accent="#0f766e" />
        <StatCard label="Rata-rata Biji/kg" value={`${summary.rataBiji}`} accent="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
        <section style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Produk terbaru</h3>
          {loading ? (
            <p>Memuat data produk...</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
              {produk.slice(0, 6).map((item) => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.nama}</div>
                    <div style={{ color: '#64748b', fontSize: '13px' }}>{item.kategori}</div>
                  </div>
                  <span>{item.biji_per_kg} butir/kg</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Menu cepat</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <QuickLink href="/produk" label="Kelola Produk" />
            <QuickLink href="/stok" label="Stok Masuk & Keluar" />
            <QuickLink href="/penjualan" label="Pembelian & Penjualan" />
            <QuickLink href="/laporan" label="Laporan Harian" />
          </div>
        </section>
      </div>
    </PageShell>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '18px', borderTop: `4px solid ${accent}`, boxShadow: '0 3px 10px rgba(15, 23, 42, 0.04)' }}>
      <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ marginTop: '8px', fontWeight: 800, fontSize: '2rem', color: '#0f172a' }}>{value}</div>
    </div>
  )
}

function QuickLink({ href, label }) {
  return (
    <a href={href} style={{ display: 'block', backgroundColor: '#ffffff', color: '#0f172a', borderRadius: '10px', padding: '12px 14px', textDecoration: 'none', border: '1px solid #e2e8f0', fontWeight: 600 }}>
      {label}
    </a>
  )
}
