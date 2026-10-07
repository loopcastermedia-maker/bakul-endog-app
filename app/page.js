'use client'

import { useEffect, useMemo, useState } from 'react'
import { calculateEstimatedBiji, calculateLineTotal } from '../lib/business'
import { getSupabaseStatusMessage, supabase } from '../lib/supabase'

export default function Home() {
  const [produk, setProduk] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [purchaseStatus, setPurchaseStatus] = useState('')
  const [stockStatus, setStockStatus] = useState('')
  const [salesStatus, setSalesStatus] = useState('')

  const [form, setForm] = useState({
    kode: '',
    nama: '',
    kategori: 'Mentah',
    biji_per_kg: 14,
  })

  const [purchase, setPurchase] = useState({
    produkId: '',
    jumlah_kg: 20,
    harga_per_kg: 0,
    catatan: '',
  })

  const [stockIn, setStockIn] = useState({
    produkId: '',
    jumlah_kg: 10,
    harga_per_kg: 0,
    catatan: '',
  })

  const [stockOut, setStockOut] = useState({
    produkId: '',
    jumlah_kg: 5,
    catatan: '',
  })

  const [sales, setSales] = useState({
    produkId: '',
    jumlah_terjual: 8,
    harga_jual: 0,
    catatan: '',
  })

  const [incomingStock, setIncomingStock] = useState([])
  const [outgoingStock, setOutgoingStock] = useState([])
  const [salesRecords, setSalesRecords] = useState([])

  const summary = useMemo(() => {
    const totalProduk = produk.length
    const kategoriSet = new Set(produk.map((item) => item.kategori || 'Lainnya'))
    const rataBiji = totalProduk
      ? Math.round(
          produk.reduce((total, item) => total + Number(item.biji_per_kg || 0), 0) / totalProduk
        )
      : 0

    return {
      totalProduk,
      totalKategori: kategoriSet.size,
      rataBiji,
    }
  }, [produk])

  const selectedProduk = useMemo(() => {
    if (!purchase.produkId) return null
    return produk.find((item) => String(item.id) === String(purchase.produkId)) || null
  }, [produk, purchase.produkId])

  const stockInSelected = useMemo(() => {
    if (!stockIn.produkId) return null
    return produk.find((item) => String(item.id) === String(stockIn.produkId)) || null
  }, [produk, stockIn.produkId])

  const stockOutSelected = useMemo(() => {
    if (!stockOut.produkId) return null
    return produk.find((item) => String(item.id) === String(stockOut.produkId)) || null
  }, [produk, stockOut.produkId])

  const salesSelected = useMemo(() => {
    if (!sales.produkId) return null
    return produk.find((item) => String(item.id) === String(sales.produkId)) || null
  }, [produk, sales.produkId])

  const purchaseTotal = calculateLineTotal(purchase.jumlah_kg, purchase.harga_per_kg)
  const estimatedBiji = selectedProduk
    ? calculateEstimatedBiji(selectedProduk.biji_per_kg, purchase.jumlah_kg)
    : 0

  const totalMasukKg = incomingStock.reduce(
    (total, item) => total + Number(item.jumlah_kg || 0),
    0
  )
  const totalKeluarKg = outgoingStock.reduce(
    (total, item) => total + Number(item.jumlah_kg || 0),
    0
  )
  const totalPembelian = incomingStock.reduce(
    (total, item) => total + calculateLineTotal(item.jumlah_kg, item.harga_per_kg),
    0
  )
  const totalPenjualan = salesRecords.reduce(
    (total, item) => total + calculateLineTotal(item.jumlah_terjual, item.harga_jual),
    0
  )
  const labaKotor = totalPenjualan - totalPembelian

  const fetchProduk = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('master_produk').select('*').order('id', { ascending: true })

      if (error) {
        setErrorMessage(error.message)
        return
      }

      setProduk(data || [])
      setErrorMessage('')

      if (data && data.length > 0) {
        setPurchase((prev) => ({ ...prev, produkId: prev.produkId || String(data[0].id) }))
        setStockIn((prev) => ({ ...prev, produkId: prev.produkId || String(data[0].id) }))
        setStockOut((prev) => ({ ...prev, produkId: prev.produkId || String(data[0].id) }))
        setSales((prev) => ({ ...prev, produkId: prev.produkId || String(data[0].id) }))
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Supabase fetch error'
      setErrorMessage(message)
      console.error('[page] Supabase fetch failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduk()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'biji_per_kg' ? Number(value) : value,
    }))
  }

  const handlePurchaseChange = (event) => {
    const { name, value } = event.target
    setPurchase((prev) => ({
      ...prev,
      [name]: ['jumlah_kg', 'harga_per_kg'].includes(name) ? Number(value) : value,
    }))
  }

  const handleStockInChange = (event) => {
    const { name, value } = event.target
    setStockIn((prev) => ({
      ...prev,
      [name]: ['jumlah_kg', 'harga_per_kg'].includes(name) ? Number(value) : value,
    }))
  }

  const handleStockOutChange = (event) => {
    const { name, value } = event.target
    setStockOut((prev) => ({
      ...prev,
      [name]: name === 'jumlah_kg' ? Number(value) : value,
    }))
  }

  const handleSalesChange = (event) => {
    const { name, value } = event.target
    setSales((prev) => ({
      ...prev,
      [name]: ['jumlah_terjual', 'harga_jual'].includes(name) ? Number(value) : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.nama.trim()) {
      setErrorMessage('Nama produk wajib diisi.')
      return
    }

    setSaving(true)

    try {
      const payload = {
        kode: form.kode || form.nama.trim().slice(0, 12).toUpperCase(),
        nama: form.nama.trim(),
        kategori: form.kategori,
        biji_per_kg: Number(form.biji_per_kg),
      }

      const { error } = await supabase.from('master_produk').insert([payload])

      if (error) {
        setErrorMessage(error.message)
        return
      }

      setForm({
        kode: '',
        nama: '',
        kategori: 'Mentah',
        biji_per_kg: 14,
      })
      await fetchProduk()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown insert error'
      setErrorMessage(message)
      console.error('[page] Insert failed:', error)
    } finally {
      setSaving(false)
    }
  }

  const handlePurchaseSubmit = (event) => {
    event.preventDefault()

    if (!selectedProduk) {
      setPurchaseStatus('Pilih produk untuk menghitung pembelian.')
      return
    }

    setPurchaseStatus(
      `Draft pembelian ${selectedProduk.nama} berhasil dihitung: ${purchase.jumlah_kg} kg x Rp ${Number(
        purchase.harga_per_kg
      ).toLocaleString('id-ID')} = Rp ${purchaseTotal.toLocaleString('id-ID')}. Estimasi ${estimatedBiji} butir.`
    )
  }

  const handleStockInSubmit = (event) => {
    event.preventDefault()

    if (!stockInSelected) {
      setStockStatus('Pilih produk untuk stok masuk.')
      return
    }

    const entry = {
      id: Date.now(),
      produk: stockInSelected.nama,
      jumlah_kg: Number(stockIn.jumlah_kg || 0),
      harga_per_kg: Number(stockIn.harga_per_kg || 0),
      catatan: stockIn.catatan,
      total: calculateLineTotal(stockIn.jumlah_kg, stockIn.harga_per_kg),
    }

    setIncomingStock((prev) => [entry, ...prev])
    setStockIn({ produkId: stockInSelected.id, jumlah_kg: 10, harga_per_kg: 0, catatan: '' })
    setStockStatus(
      `Stok masuk ${entry.produk} berhasil ditambahkan: ${entry.jumlah_kg} kg, total Rp ${entry.total.toLocaleString('id-ID')}.`
    )
  }

  const handleStockOutSubmit = (event) => {
    event.preventDefault()

    if (!stockOutSelected) {
      setStockStatus('Pilih produk untuk stok keluar.')
      return
    }

    const entry = {
      id: Date.now(),
      produk: stockOutSelected.nama,
      jumlah_kg: Number(stockOut.jumlah_kg || 0),
      catatan: stockOut.catatan,
    }

    setOutgoingStock((prev) => [entry, ...prev])
    setStockOut({ produkId: stockOutSelected.id, jumlah_kg: 5, catatan: '' })
    setStockStatus(
      `Stok keluar ${entry.produk} berhasil dicatat: ${entry.jumlah_kg} kg.`
    )
  }

  const handleSalesSubmit = (event) => {
    event.preventDefault()

    if (!salesSelected) {
      setSalesStatus('Pilih produk untuk penjualan harian.')
      return
    }

    const entry = {
      id: Date.now(),
      produk: salesSelected.nama,
      jumlah_terjual: Number(sales.jumlah_terjual || 0),
      harga_jual: Number(sales.harga_jual || 0),
      catatan: sales.catatan,
      total: calculateLineTotal(sales.jumlah_terjual, sales.harga_jual),
    }

    setSalesRecords((prev) => [entry, ...prev])
    setSales({ produkId: salesSelected.id, jumlah_terjual: 8, harga_jual: 0, catatan: '' })
    setSalesStatus(
      `Penjualan ${entry.produk} berhasil dihitung: Rp ${entry.total.toLocaleString('id-ID')}.`
    )
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '32px auto', backgroundColor: '#f5f7fb', padding: '24px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
      <h1 style={{ color: '#1f4e79', marginTop: 0, marginBottom: '12px', fontSize: '2.2rem' }}>🥚 Bakul Endog Dashboard</h1>
      <p style={{ marginTop: 0, marginBottom: '20px', color: '#334155', fontSize: '1rem' }}>Selamat datang di aplikasi manajemen stok, pembelian dan penjualan telur.</p>

      <div style={{ marginBottom: '20px', padding: '12px 14px', backgroundColor: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '10px', color: '#0f172a', fontSize: '13px' }}>
        <strong>Supabase status:</strong> {getSupabaseStatusMessage()}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', marginBottom: '22px' }}>
        <StatCard label="Total Produk" value={summary.totalProduk} accent="#1d4ed8" />
        <StatCard label="Kategori" value={summary.totalKategori} accent="#0f766e" />
        <StatCard label="Rata-rata Biji/kg" value={`${summary.rataBiji}`} accent="#f59e0b" />
        <StatCard label="Stok Balance" value={`${totalMasukKg - totalKeluarKg} kg`} accent="#16a34a" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '22px', alignItems: 'start' }}>
        <section style={{ backgroundColor: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 3px 10px rgba(15, 23, 42, 0.04)' }}>
          <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', marginTop: 0 }}>Daftar Produk di Database</h3>

          {loading ? (
            <div style={{ padding: '14px', color: '#475569' }}>Memuat data produk...</div>
          ) : errorMessage ? (
            <div style={{ padding: '15px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>
              <strong>❌ Gagal Koneksi:</strong> {errorMessage}
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {produk.map((p) => (
                <li key={p.id} style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1f4e79' }}>{p.kode || p.nama}</div>
                    <div style={{ color: '#334155' }}>{p.nama}</div>
                  </div>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '6px 10px', borderRadius: '8px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                    {p.biji_per_kg} butir/kg
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ backgroundColor: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 3px 10px rgba(15, 23, 42, 0.04)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '14px' }}>Tambah Produk Baru</h3>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Kode</label>
              <input name="kode" value={form.kode} onChange={handleChange} style={inputStyle} placeholder="BM-A" />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Nama Produk</label>
              <input name="nama" value={form.nama} onChange={handleChange} style={inputStyle} placeholder="Bebek Mentah A" required />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Kategori</label>
              <select name="kategori" value={form.kategori} onChange={handleChange} style={inputStyle}>
                <option value="Mentah">Mentah</option>
                <option value="Asin">Asin</option>
                <option value="Matang">Matang</option>
                <option value="Puyuh">Puyuh</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Biji per kg</label>
              <input name="biji_per_kg" type="number" min="1" value={form.biji_per_kg} onChange={handleChange} style={inputStyle} />
            </div>

            <button type="submit" disabled={saving} style={{
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 16px',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.8 : 1,
            }}>
              {saving ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </form>
        </section>
      </div>

      <section style={{ marginTop: '22px', backgroundColor: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 3px 10px rgba(15, 23, 42, 0.04)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Pembelian Harian</h3>

        <form onSubmit={handlePurchaseSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Produk</label>
            <select name="produkId" value={purchase.produkId} onChange={handlePurchaseChange} style={inputStyle}>
              {produk.map((item) => (
                <option key={item.id} value={item.id}>{item.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Jumlah (kg)</label>
            <input name="jumlah_kg" type="number" min="1" value={purchase.jumlah_kg} onChange={handlePurchaseChange} style={inputStyle} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Harga per kg</label>
            <input name="harga_per_kg" type="number" min="0" value={purchase.harga_per_kg} onChange={handlePurchaseChange} style={inputStyle} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Catatan</label>
            <textarea name="catatan" value={purchase.catatan} onChange={handlePurchaseChange} rows="3" style={{ ...inputStyle, resize: 'vertical' }} placeholder="Catatan pembelian atau keterangan supplier" />
          </div>

          <div style={{ gridColumn: '1 / -1', backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px 14px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '14px', color: '#475569', marginBottom: '6px' }}>Estimasi total</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1f4e79' }}>Rp {purchaseTotal.toLocaleString('id-ID')}</div>
            <div style={{ marginTop: '4px', color: '#0f172a', fontSize: '13px' }}>
              {selectedProduk ? `${selectedProduk.nama} • ${estimatedBiji} butir estimasi` : 'Pilih produk untuk melihat estimasi'}
            </div>
          </div>

          <button type="submit" style={{ gridColumn: '1 / -1', backgroundColor: '#f59e0b', color: '#111827', border: 'none', borderRadius: '10px', padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>
            Hitung Pembelian
          </button>
        </form>

        {purchaseStatus ? (
          <div style={{ marginTop: '14px', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '8px', padding: '10px 12px', border: '1px solid #bbf7d0' }}>
            {purchaseStatus}
          </div>
        ) : null}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '22px', marginTop: '22px' }}>
        <section style={{ backgroundColor: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 3px 10px rgba(15, 23, 42, 0.04)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '14px' }}>Stok Masuk</h3>
          <form onSubmit={handleStockInSubmit} style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Produk</label>
              <select name="produkId" value={stockIn.produkId} onChange={handleStockInChange} style={inputStyle}>
                {produk.map((item) => (
                  <option key={item.id} value={item.id}>{item.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Jumlah (kg)</label>
              <input name="jumlah_kg" type="number" min="1" value={stockIn.jumlah_kg} onChange={handleStockInChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Harga per kg</label>
              <input name="harga_per_kg" type="number" min="0" value={stockIn.harga_per_kg} onChange={handleStockInChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Catatan</label>
              <textarea name="catatan" value={stockIn.catatan} onChange={handleStockInChange} rows="3" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <button type="submit" style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>
              Tambah Stok Masuk
            </button>
          </form>
          <div style={{ marginTop: '14px', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '8px', padding: '10px 12px', border: '1px solid #bbf7d0' }}>
            Total masuk: {totalMasukKg} kg
          </div>
        </section>

        <section style={{ backgroundColor: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 3px 10px rgba(15, 23, 42, 0.04)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '14px' }}>Stok Keluar</h3>
          <form onSubmit={handleStockOutSubmit} style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Produk</label>
              <select name="produkId" value={stockOut.produkId} onChange={handleStockOutChange} style={inputStyle}>
                {produk.map((item) => (
                  <option key={item.id} value={item.id}>{item.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Jumlah (kg)</label>
              <input name="jumlah_kg" type="number" min="1" value={stockOut.jumlah_kg} onChange={handleStockOutChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Catatan</label>
              <textarea name="catatan" value={stockOut.catatan} onChange={handleStockOutChange} rows="3" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <button type="submit" style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>
              Catat Stok Keluar
            </button>
          </form>
          <div style={{ marginTop: '14px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '8px', padding: '10px 12px', border: '1px solid #fecaca' }}>
            Total keluar: {totalKeluarKg} kg
          </div>
        </section>

        <section style={{ backgroundColor: 'white', borderRadius: '12px', padding: '18px', boxShadow: '0 3px 10px rgba(15, 23, 42, 0.04)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '14px' }}>Penjualan Harian</h3>
          <form onSubmit={handleSalesSubmit} style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Produk</label>
              <select name="produkId" value={sales.produkId} onChange={handleSalesChange} style={inputStyle}>
                {produk.map((item) => (
                  <option key={item.id} value={item.id}>{item.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Jumlah terjual</label>
              <input name="jumlah_terjual" type="number" min="1" value={sales.jumlah_terjual} onChange={handleSalesChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Harga jual</label>
              <input name="harga_jual" type="number" min="0" value={sales.harga_jual} onChange={handleSalesChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#334155' }}>Catatan</label>
              <textarea name="catatan" value={sales.catatan} onChange={handleSalesChange} rows="3" style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <button type="submit" style={{ backgroundColor: '#f59e0b', color: '#111827', border: 'none', borderRadius: '10px', padding: '12px 16px', fontWeight: 700, cursor: 'pointer' }}>
              Hitung Penjualan
            </button>
          </form>
          <div style={{ marginTop: '14px', backgroundColor: '#fefce8', color: '#854d0e', borderRadius: '8px', padding: '10px 12px', border: '1px solid #fcd34d' }}>
            Total penjualan: Rp {totalPenjualan.toLocaleString('id-ID')} | Laba kotor: Rp {labaKotor.toLocaleString('id-ID')}
          </div>
        </section>
      </div>

      {stockStatus ? (
        <div style={{ marginTop: '20px', backgroundColor: '#f0fdf4', color: '#166534', borderRadius: '8px', padding: '12px 14px', border: '1px solid #bbf7d0' }}>
          {stockStatus}
        </div>
      ) : null}

      {salesStatus ? (
        <div style={{ marginTop: '12px', backgroundColor: '#fefce8', color: '#854d0e', borderRadius: '8px', padding: '12px 14px', border: '1px solid #fcd34d' }}>
          {salesStatus}
        </div>
      ) : null}
    </main>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 3px 10px rgba(15, 23, 42, 0.04)', padding: '18px', borderTop: `4px solid ${accent}` }}>
      <div style={{ color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ marginTop: '8px', fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{value}</div>
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
  outline: 'none',
  backgroundColor: '#fff',
}
