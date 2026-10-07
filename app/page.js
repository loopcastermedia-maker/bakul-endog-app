'use client'

import { useEffect, useState } from 'react'
import { getSupabaseStatusMessage, supabase } from '../lib/supabase'

export default function Home() {
  const [produk, setProduk] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    kode: '',
    nama: '',
    kategori: 'Mentah',
    biji_per_kg: 14,
  })

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

  return (
    <main style={{ maxWidth: '900px', margin: '32px auto', backgroundColor: '#f5f7fb', padding: '24px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
      <h1 style={{ color: '#1f4e79', marginTop: 0, marginBottom: '12px', fontSize: '2.2rem' }}>🥚 Bakul Endog Dashboard</h1>
      <p style={{ marginTop: 0, marginBottom: '20px', color: '#334155', fontSize: '1rem' }}>Selamat datang di aplikasi manajemen stok dan keuangan telur.</p>

      <div style={{ marginBottom: '20px', padding: '12px 14px', backgroundColor: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '10px', color: '#0f172a', fontSize: '13px' }}>
        <strong>Supabase status:</strong> {getSupabaseStatusMessage()}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '22px', alignItems: 'start' }}>
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
    </main>
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
