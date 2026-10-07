'use client'

import PageShell from '../components/PageShell'

const summary = {
  penjualan: 1850000,
  pembelian: 1200000,
  laba: 650000,
  stokAkhir: 320,
  totalTransaksi: 28,
}

const items = [
  { nama: 'Bebek Mentah A', jumlah: 120, total: 'Rp 720.000' },
  { nama: 'Puyuh Asin', jumlah: 80, total: 'Rp 540.000' },
  { nama: 'Bebek Matang', jumlah: 68, total: 'Rp 420.000' },
]

export default function LaporanPage() {
  return (
    <PageShell title="Laporan" subtitle="Ringkasan operasional harian dan bulanan.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '16px', marginBottom: '22px' }}>
        <StatCard label="Penjualan" value={`Rp ${summary.penjualan.toLocaleString('id-ID')}`} accent="#16a34a" />
        <StatCard label="Pembelian" value={`Rp ${summary.pembelian.toLocaleString('id-ID')}`} accent="#f59e0b" />
        <StatCard label="Laba" value={`Rp ${summary.laba.toLocaleString('id-ID')}`} accent="#1d4ed8" />
        <StatCard label="Stok Akhir" value={`${summary.stokAkhir} kg`} accent="#0f766e" />
        <StatCard label="Transaksi" value={`${summary.totalTransaksi}`} accent="#7c3aed" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
        <section style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ marginTop: 0 }}>Detail produk</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'grid', gap: '10px' }}>
            {items.map((item) => (
              <li key={item.nama} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.nama}</div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>{item.jumlah} kg</div>
                </div>
                <strong>{item.total}</strong>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ marginTop: 0 }}>Catatan</h3>
          <ul style={{ margin: '14px 0 0', paddingLeft: '18px', color: '#334155', display: 'grid', gap: '10px' }}>
            <li>Target stok harian tercapai.</li>
            <li>Penjualan naik dari minggu sebelumnya.</li>
            <li>Biaya pembelian masih dalam batas kontrol.</li>
            <li>Produk dengan performa tertinggi adalah Bebek Mentah A.</li>
          </ul>
        </section>
      </div>
    </PageShell>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '18px', borderTop: `4px solid ${accent}`, boxShadow: '0 3px 10px rgba(15, 23, 42, 0.04)' }}>
      <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ marginTop: '8px', fontWeight: 800, fontSize: '1.4rem', color: '#0f172a' }}>{value}</div>
    </div>
  )
}
