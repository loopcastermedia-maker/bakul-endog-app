import Link from 'next/link'

const items = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/produk', label: 'Produk' },
  { href: '/stok', label: 'Stok' },
  { href: '/penjualan', label: 'Penjualan' },
  { href: '/laporan', label: 'Laporan' },
]

export default function Navigation() {
  return (
    <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            textDecoration: 'none',
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: item.href === '/' ? '#1f4e79' : '#ffffff',
            color: item.href === '/' ? '#fff' : '#1f2937',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
          }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
