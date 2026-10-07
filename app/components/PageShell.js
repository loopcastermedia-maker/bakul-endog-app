export default function PageShell({ title, subtitle, children }) {
  return (
    <main style={{ maxWidth: '1200px', margin: '32px auto', padding: '20px' }}>
      <section style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '24px', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.05)' }}>
        <h1 style={{ margin: '0 0 8px', color: '#1f4e79', fontSize: '2rem' }}>{title}</h1>
        {subtitle ? <p style={{ margin: '0 0 20px', color: '#475569' }}>{subtitle}</p> : null}
        {children}
      </section>
    </main>
  )
}
