import { useState } from 'react'
import { nav, profile } from '../data/portfolio.js'

const linkClass = 'block rounded-md px-3 py-2 text-sm font-medium text-muted hover:text-text'

export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-bg/80 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="font-bold tracking-tight">
          {profile.name}
        </a>
        <ul className="hidden items-center gap-1 sm:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a className={linkClass} href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="rounded-md px-3 py-2 text-sm font-medium sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </nav>
      {open && (
        <ul id="mobile-nav" className="border-t border-white/5 px-5 pb-4 sm:hidden">
          {nav.map((item) => (
            <li key={item.href}>
              <a className={linkClass} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
