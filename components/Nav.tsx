'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const NAV_ITEMS = [
  { href: '/', label: 'Accueil' },
  { href: '/collections', label: 'Collections' },
  { href: '/articles', label: 'Articles' },
  { href: '/medias', label: 'Médias' },
  { href: '/about', label: "L'Association" },
]

export default function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav
        style={{
          borderBottom: scrolled ? '4px solid var(--rust)' : undefined,
          boxShadow: scrolled ? '0 4px 24px rgba(26,22,20,0.45)' : undefined,
        }}
      >
        <Link className="nav-logo-block" href="/">
          <img
           className="nav-logo-img"
           src="/Logo_Medina_Wiratha.png"
            alt="Medina Wiratha"
            style={{ height: '32px', width: 'auto' }}
          />
          <div className="nav-sep" />
          <div className="nav-full">
            Musée de la
            <br />
            Photographie de Moroni
          </div>
        </Link>
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              className={`nav-link${isActive(item.href) ? ' active' : ''}`}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <div className="mobile-links">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} className="m-link" href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
