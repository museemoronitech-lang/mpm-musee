'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-col">
          <Image
            className="footer-logo-img"
            src="/Logo_Medina_Wiratha.png"
            alt="Medina Wiratha"
            width={120}
            height={68}
            style={{ height: '68px', width: 'auto' }}
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <p className="footer-desc">
            Musée de la Photographie de Moroni.
            <br />
            Archives photographiques des Comores,
            <br />
            1880–1995.
          </p>
          <p className="footer-desc" style={{ marginTop: '0.85rem', color: 'rgba(242,237,228,0.18)' }}>
            En partenariat avec la CNDRS · Comores
          </p>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Collections</div>
          <Link className="footer-link" href="/collections?tab=periode">Par Période</Link>
          <Link className="footer-link" href="/collections?tab=auteurs">Par Photographe</Link>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Musée</div>
          <Link className="footer-link" href="/articles">Articles</Link>
          <Link className="footer-link" href="/medias">Médias</Link>
          <Link className="footer-link" href="/about">À propos</Link>
        </div>
        <div className="footer-col">
          <div className="footer-col-title">Accès</div>
          <Link href="/admin" style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '0.56rem', color: 'rgba(242,237,228,0.2)', opacity: 0.4, padding: '0.25rem 0', textDecoration: 'none' }}>·</Link>
          <span className="footer-link">CNDRS</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2025 Musée de la Photographie de Moroni · Medina Wiratha · Seaview Artwork</span>
        <span className="footer-udata">
          Développé par <a href="#">U-DATA</a>
        </span>
      </div>
    </footer>
  )
}
