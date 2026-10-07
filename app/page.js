'use client'

import { useEffect, useMemo, useState } from 'react'
import { getSupabaseStatusMessage, supabase } from '../lib/supabase'

export default function Home() {
  const [produk, setProduk] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [purchaseStatus, setPurchaseStatus] = useState('')
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

  const purchaseTotal = Number(purchase.jumlah_kg || 0) * Number(purchase.harga_per_kg || 0)
  const estimatedBiji = selectedProduk
    ? Number(selectedProduk.biji_per_kg || 0) * Number(purchase.jumlah_kg || 0)
    : 0

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

      if (data && data.length > 0 && !purchase.produkId) {
        setPurchase((prev) => ({ ...prev, produkId: String(data[0].id) }))
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
      [name]: name === 'jumlah_kg' || name === 'harga_per_kg' ? Number(value) : value,
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

  return (
    <main style={{ maxWidth: '1100px', margin: '32px auto', backgroundColor: '#f5f7fb', padding: '24px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
      <h1 style={{ color: '#1f4e79', marginTop: 0, marginBottom: '12px', fontSize: '2.2rem' }}>🥚 Bakul Endog Dashboard</h1>
      <p style={{ marginTop: 0, marginBottom: '20px', color: '#334155', fontSize: '1rem' }}>Selamat datang di aplikasi manajemen stok dan pembelian telur.</p>

      <div style={{ marginBottom: '20px', padding: '12px 14px', backgroundColor: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '10px', color: '#0f172a', fontSize: '13px' }}>
        <strong>Supabase status:</strong> {getSupabaseStatusMessage()}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px', marginBottom: '22px' }}>
        <StatCard label="Total Produk" value={summary.totalProduk} accent="#1d4ed8" />
        <StatCard label="Kategori" value={summary.totalKategori} accent="#0f766e" />
        <StatCard label="Rata-rata Biji/kg" value={`${summary.rataBiji}`} accent="#f59e0b" />
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
