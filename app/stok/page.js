'use client'

import { useMemo, useState } from 'react'
import PageShell from '../components/PageShell'

const initialProducts = [
  { id: 1, nama: 'Bebek Mentah A', kategori: 'Mentah', biji_per_kg: 14 },
  { id: 2, nama: 'Puyuh Asin', kategori: 'Asin', biji_per_kg: 17 },
  { id: 3, nama: 'Bebek Matang', kategori: 'Matang', biji_per_kg: 15 },
]

export default function StokPage() {
  const [products] = useState(initialProducts)
  const [stockIn, setStockIn] = useState({ produkId: '1', jumlah_kg: 10, harga_per_kg: 0, catatan: '' })
  const [stockOut, setStockOut] = useState({ produkId: '1', jumlah_kg: 5, catatan: '' })
  const [status, setStatus] = useState('')
  const [incomingStock, setIncomingStock] = useState([
    { id: 1, produk: 'Bebek Mentah A', jumlah_kg: 30, total: 360000 },
  ])
  const [outgoingStock, setOutgoingStock] = useState([
    { id: 1, produk: 'Bebek Mentah A', jumlah_kg: 12 },
  ])

  const productMap = useMemo(() => Object.fromEntries(products.map((item) => [String(item.id), item])), [products])

  const handleStockIn = (event) => {
    event.preventDefault()
    const product = productMap[String(stockIn.produkId)]
    if (!product) {
      setStatus('Produk tidak ditemukan.')
      return
    }

    const total = Number(stockIn.jumlah_kg || 0) * Number(stockIn.harga_per_kg || 0)
    const entry = { id: Date.now(), produk: product.nama, jumlah_kg: Number(stockIn.jumlah_kg || 0), total }
    setIncomingStock((prev) => [entry, ...prev])
    setStatus(`Stok masuk ${product.nama} berhasil ditambahkan: ${stockIn.jumlah_kg} kg.`)
  }

  const handleStockOut = (event) => {
    event.preventDefault()
    const product = productMap[String(stockOut.produkId)]
    if (!product) {
      setStatus('Produk tidak ditemukan.')
      return
    }

    const entry = { id: Date.now(), produk: product.nama, jumlah_kg: Number(stockOut.jumlah_kg || 0) }
    setOutgoingStock((prev) => [entry, ...prev])
    setStatus(`Stok keluar ${product.nama} berhasil dicatat: ${stockOut.jumlah_kg} kg.`)
  }

  const totalMasuk = incomingStock.reduce((sum, item) => sum + Number(item.jumlah_kg || 0), 0)
  const totalKeluar = outgoingStock.reduce((sum, item) => sum + Number(item.jumlah_kg || 0), 0)

  return (
    <PageShell title="Stok" subtitle="Kelola stok masuk dan keluar harian.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px', marginBottom: '20px' }}>
        <StatCard label="Total Masuk" value={`${totalMasuk} kg`} accent="#16a34a" />
        <StatCard label="Total Keluar" value={`${totalKeluar} kg`} accent="#ef4444" />
        <StatCard label="Saldo" value={`${totalMasuk - totalKeluar} kg`} accent="#1d4ed8" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px' }}>
        <section style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '14px' }}>Stok Masuk</h3>
          <form onSubmit={handleStockIn} style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Produk</label>
              <select value={stockIn.produkId} onChange={(e) => setStockIn((prev) => ({ ...prev, produkId: e.target.value }))} style={inputStyle}>
                {products.map((item) => (
                  <option key={item.id} value={String(item.id)}>{item.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Jumlah (kg)</label>
              <input type="number" min="1" value={stockIn.jumlah_kg} onChange={(e) => setStockIn((prev) => ({ ...prev, jumlah_kg: Number(e.target.value) }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Harga per kg</label>
              <input type="number" min="0" value={stockIn.harga_per_kg} onChange={(e) => setStockIn((prev) => ({ ...prev, harga_per_kg: Number(e.target.value) }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Catatan</label>
              <textarea rows="3" value={stockIn.catatan} onChange={(e) => setStockIn((prev) => ({ ...prev, catatan: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <button type="submit" style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 16px', fontWeight: 700 }}>Tambah Stok Masuk</button>
          </form>
        </section>

        <section style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '14px' }}>Stok Keluar</h3>
          <form onSubmit={handleStockOut} style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Produk</label>
              <select value={stockOut.produkId} onChange={(e) => setStockOut((prev) => ({ ...prev, produkId: e.target.value }))} style={inputStyle}>
                {products.map((item) => (
                  <option key={item.id} value={String(item.id)}>{item.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Jumlah (kg)</label>
              <input type="number" min="1" value={stockOut.jumlah_kg} onChange={(e) => setStockOut((prev) => ({ ...prev, jumlah_kg: Number(e.target.value) }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Catatan</label>
              <textarea rows="3" value={stockOut.catatan} onChange={(e) => setStockOut((prev) => ({ ...prev, catatan: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <button type="submit" style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 16px', fontWeight: 700 }}>Catat Stok Keluar</button>
          </form>
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '22px' }}>
        <section style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Riwayat masuk</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px' }}>
            {incomingStock.map((item) => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <span>{item.produk}</span>
                <strong>{item.jumlah_kg} kg</strong>
              </li>
            ))}
          </ul>
        </section>

        <section style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Riwayat keluar</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '8px' }}>
            {outgoingStock.map((item) => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <span>{item.produk}</span>
                <strong>{item.jumlah_kg} kg</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {status ? (
        <div style={{ marginTop: '18px', backgroundColor: '#f0fdf4', color: '#166534', padding: '12px 14px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
          {status}
        </div>
      ) : null}
    </PageShell>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', borderTop: `4px solid ${accent}`, boxShadow: '0 3px 10px rgba(15, 23, 42, 0.04)', padding: '18px' }}>
      <div style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ marginTop: '8px', fontWeight: 800, fontSize: '1.8rem' }}>{value}</div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #dbe2ea',
  fontSize: '14px',
  backgroundColor: '#fff',
}
