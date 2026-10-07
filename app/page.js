import { supabase } from '../lib/supabase'

export default async function Home() {
  const { data: produk, error } = await supabase.from('master_produk').select('*')

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h1 style={{ color: '#1f4e79', marginTop: 0 }}>🥚 Bakul Endog Dashboard</h1>
      <p>Selamat datang di aplikasi manajemen stok dan keuangan telur.</p>
      
      <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px' }}>Daftar Produk di Database:</h3>
      
      {error ? (
        <div style={{ padding: '15px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>
          <strong>❌ Gagal Koneksi:</strong> {error.message}
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {produk?.map((p) => (
            <li key={p.id} style={{ padding: '12px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#1f4e79' }}>{p.id}</strong>
                <span style={{ marginLeft: '10px', color: '#333' }}>{p.nama}</span>
              </div>
              <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' }}>
                {p.biji_per_kg} butir/kg
              </span>
            </li>
          ))}
        </ul>
      )}
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: error ? '#fee2e2' : '#dcfce7', borderRadius: '6px', textAlign: 'center' }}>
        <h4 style={{ margin: 0, color: error ? '#991b1b' : '#166534' }}>
          {error ? '❌ Database Tidak Terhubung' : '✅ Database Berhasil Terhubung!'}
        </h4>
      </div>
    </main>
  )
}