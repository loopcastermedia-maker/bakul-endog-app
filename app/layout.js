export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f4f4f5', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}