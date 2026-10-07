import Link from 'next/link'

const modules = [
  { href: '/dashboard', title: 'Dashboard', desc: 'Ringkasan operasional harian.' },
  { href: '/produk', title: 'Produk', desc: 'Master produk dan kategori telur.' },
  { href: '/stok', title: 'Stok', desc: 'Stok masuk dan stok keluar.' },
  { href: '/penjualan', title: 'Penjualan', desc: 'Pembelian dan penjualan harian.' },
  { href: '/laporan', title: 'Laporan', desc: 'Laba, penjualan, dan ringkasan.' },
]

export default function Home() {
  return (
    <main style={{ maxWidth: '1100px', margin: '32px auto', padding: '20px' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '32px', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)' }}>
        <p style={{ margin: 0, color: '#1d4ed8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '12px' }}>Bakul Endog</p>
        <h1 style={{ margin: '10px 0 12px', fontSize: '2.4rem', color: '#0f172a' }}>Sistem Manajemen Bisnis Telur</h1>
        <p style={{ margin: '0 0 24px', color: '#475569', fontSize: '1rem', maxWidth: '700px' }}>
          Mulai dari produk, stok, pembelian, penjualan, sampai laporan harian. Semua modul dipisah jadi halaman agar lebih rapi dan mudah dikembangkan.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' }}>
          {modules.map((module) => (
            <Link key={module.href} href={module.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Module</div>
                <h2 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '1.5rem' }}>{module.title}</h2>
                <p style={{ margin: 0, color: '#475569' }}>{module.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
