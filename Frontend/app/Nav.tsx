'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/employees', label: 'Employees' },
  { href: '/projects', label: 'Projects' },
] as const

export default function Nav() {
  const pathname = usePathname()

  return (
    <nav className="nav">
      <span className="nav-brand">Employee & Projects</span>
      {links.map(({ href, label }) => {
        const isActive = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={isActive ? 'active' : undefined}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
