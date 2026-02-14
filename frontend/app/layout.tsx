'use client'
import './globals.css'
import StoreProvider from './store/StoreProvider'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
