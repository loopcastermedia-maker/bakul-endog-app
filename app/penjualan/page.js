'use client'

import { useMemo, useState } from 'react'
import PageShell from '../components/PageShell'
import { calculateEstimatedBiji, calculateLineTotal } from '../../lib/business'

const initialProducts = [
  { id: 1, nama: 'Bebek Mentah A', kategori: 'Mentah', biji_per_kg: 14 },
  { id: 2, nama: 'Puyuh Asin', kategori: 'Asin', biji_per_kg: 17 },
]

export default function PenjualanPage() {
  const [products] = useState(initialProducts)
  const [purchase, setPurchase] = useState({ produkId: '1', jumlah_kg: 20, harga_per_kg: 18000, catatan: '' })
  const [sales, setSales] = useState({ produkId: '1', jumlah_terjual: 8, harga_jual: 25000, catatan: '' })
  const [status, setStatus] = useState('')

  const productMap = useMemo(() => Object.fromEntries(products.map((item) => [String(item.id), item])), [products])
  const selectedProduk = productMap[String(purchase.produkId)] || null
  const salesSelected = productMap[String(sales.produkId)] || null

  const purchaseTotal = calculateLineTotal(purchase.jumlah_kg, purchase.harga_per_kg)
  const estimatedBiji = selectedProduk ? calculateEstimatedBiji(selectedProduk.biji_per_kg, purchase.jumlah_kg) : 0
  const salesTotal = calculateLineTotal(sales.jumlah_terjual, sales.harga_jual)

  const handlePurchase = (event) => {
    event.preventDefault()
    if (!selectedProduk) {
      setStatus('Pilih produk terlebih dahulu.')
      return
    }

    setStatus(`Draft pembelian ${selectedProduk.nama}: ${purchase.jumlah_kg} kg x Rp ${purchase.harga_per_kg.toLocaleString('id-ID')} = Rp ${purchaseTotal.toLocaleString('id-ID')}. Estimasi ${estimatedBiji} butir.`)
  }

  const handleSales = (event) => {
    event.preventDefault()
    if (!salesSelected) {
      setStatus('Pilih produk untuk penjualan.')
      return
    }

    setStatus(`Penjualan ${salesSelected.nama}: ${sales.jumlah_terjual} unit x Rp ${sales.harga_jual.toLocaleString('id-ID')} = Rp ${salesTotal.toLocaleString('id-ID')}.`)
  }

  return (
    <PageShell title="Penjualan" subtitle="Pembelian dan penjualan harian untuk tiap produk.">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '20px' }}>
        <section style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '14px' }}>Pembelian Harian</h3>
          <form onSubmit={handlePurchase} style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Produk</label>
              <select value={purchase.produkId} onChange={(e) => setPurchase((prev) => ({ ...prev, produkId: e.target.value }))} style={inputStyle}>
                {products.map((item) => (
                  <option key={item.id} value={String(item.id)}>{item.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Jumlah (kg)</label>
              <input type="number" min="1" value={purchase.jumlah_kg} onChange={(e) => setPurchase((prev) => ({ ...prev, jumlah_kg: Number(e.target.value) }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Harga per kg</label>
              <input type="number" min="0" value={purchase.harga_per_kg} onChange={(e) => setPurchase((prev) => ({ ...prev, harga_per_kg: Number(e.target.value) }))} style={inputStyle} />
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '12px' }}>
              <div style={{ color: '#475569', fontSize: '14px' }}>Estimasi total</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1f4e79' }}>Rp {purchaseTotal.toLocaleString('id-ID')}</div>
              <div style={{ marginTop: '4px', color: '#0f172a' }}>{selectedProduk ? `${selectedProduk.nama} • ${estimatedBiji} butir estimasi` : 'Pilih produk'}</div>
            </div>
            <button type="submit" style={{ backgroundColor: '#f59e0b', color: '#111827', border: 'none', borderRadius: '10px', padding: '12px 16px', fontWeight: 700 }}>Hitung Pembelian</button>
          </form>
        </section>

        <section style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '14px' }}>Penjualan Harian</h3>
          <form onSubmit={handleSales} style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Produk</label>
              <select value={sales.produkId} onChange={(e) => setSales((prev) => ({ ...prev, produkId: e.target.value }))} style={inputStyle}>
                {products.map((item) => (
                  <option key={item.id} value={String(item.id)}>{item.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Jumlah terjual</label>
              <input type="number" min="1" value={sales.jumlah_terjual} onChange={(e) => setSales((prev) => ({ ...prev, jumlah_terjual: Number(e.target.value) }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Harga jual</label>
              <input type="number" min="0" value={sales.harga_jual} onChange={(e) => setSales((prev) => ({ ...prev, harga_jual: Number(e.target.value) }))} style={inputStyle} />
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '12px' }}>
              <div style={{ color: '#475569', fontSize: '14px' }}>Total penjualan</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1f4e79' }}>Rp {salesTotal.toLocaleString('id-ID')}</div>
              <div style={{ marginTop: '4px', color: '#0f172a' }}>{salesSelected ? `${salesSelected.nama}` : 'Pilih produk'}</div>
            </div>
            <button type="submit" style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 16px', fontWeight: 700 }}>Hitung Penjualan</button>
          </form>
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

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1px solid #dbe2ea',
  fontSize: '14px',
  backgroundColor: '#fff',
}
