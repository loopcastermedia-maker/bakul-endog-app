import PageShell from '../components/PageShell'

export default function MitraPage() {
  return (
    <PageShell title="Mitra" subtitle="Titipan dan piutang usaha">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="font-bold text-amber-900">Data mitra belum tersedia</p>
        <p className="mt-1 text-sm leading-5 text-amber-900/80">
          Ringkasan titipan dan piutang di Beranda masih data contoh. Halaman ini belum terhubung ke tabel mitra Supabase.
        </p>
      </div>
    </PageShell>
  )
}