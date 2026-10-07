import BottomNav from '../components/BottomNav'
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#f4f4f5] font-sans text-zinc-900">
        <div className="mx-auto min-h-dvh max-w-[480px] bg-[#f4f4f5]">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  )
}