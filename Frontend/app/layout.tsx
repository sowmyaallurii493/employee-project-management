import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import Nav from './Nav'
import { AppProvider } from './context/AppContext'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Employee Project Management',
  description: 'Frontend evaluation UI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        <AppProvider>
          <div className="container">
            <Nav />
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
