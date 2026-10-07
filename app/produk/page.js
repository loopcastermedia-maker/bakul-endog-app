'use client'

import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import { getSupabaseStatusMessage, supabase } from '../../lib/supabase'

export default function ProdukPage() {
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
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
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

      setForm({ kode: '', nama: '', kategori: 'Mentah', biji_per_kg: 14 })
      await fetchProduk()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageShell title="Produk" subtitle="Manajemen master produk telur dan kategori.">
      <div style={{ marginBottom: '18px', padding: '12px 14px', backgroundColor: '#ecfeff', border: '1px solid #a5f3fc', borderRadius: '10px' }}>
        <strong>Supabase status:</strong> {getSupabaseStatusMessage()}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '20px' }}>
        <section style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '14px' }}>Tambah produk baru</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Kode</label>
              <input name="kode" value={form.kode} onChange={handleChange} style={inputStyle} placeholder="BM-A" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Nama Produk</label>
              <input name="nama" value={form.nama} onChange={handleChange} style={inputStyle} placeholder="Bebek Mentah A" required />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Kategori</label>
              <select name="kategori" value={form.kategori} onChange={handleChange} style={inputStyle}>
                <option value="Mentah">Mentah</option>
                <option value="Asin">Asin</option>
                <option value="Matang">Matang</option>
                <option value="Puyuh">Puyuh</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Biji per kg</label>
              <input name="biji_per_kg" type="number" min="1" value={form.biji_per_kg} onChange={handleChange} style={inputStyle} />
            </div>
            <button type="submit" disabled={saving} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: '10px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.8 : 1 }}>
              {saving ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </form>
        </section>

        <section style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '18px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '14px' }}>Daftar produk</h3>
          {loading ? (
            <p>Memuat data...</p>
          ) : errorMessage ? (
            <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '8px' }}>{errorMessage}</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
              {produk.map((item) => (
                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 10px', borderBottom: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.kode || item.nama}</div>
                    <div style={{ color: '#64748b', fontSize: '13px' }}>{item.nama}</div>
                  </div>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                    {item.biji_per_kg} butir/kg
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
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
