'use client'

import { useEffect, useRef } from 'react'
import { Photo } from '@/types'
import PhotoCard from './PhotoCard'
import Link from 'next/link'

const TICKER_ITEMS = [
  '2 400 photographies archivées',
  'Moroni · Ngazidja',
  'Archives 1880–1995',
  'En partenariat avec le CNDRS',
  'Musée de la Photographie de Moroni',
  'Initiative Medina Wiratha',
]

export default function HomeClient({ photos }: { photos: Photo[] }) {
  const pub = photos.filter(p => p.image_url).slice(0, 6)
  const total = photos.length
  const pubCount = photos.filter(p => p.status === 'pub').length
  const heroBgRef = useRef<HTMLDivElement>(null)

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      })
    }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' })

    document.querySelectorAll('.reveal:not(.visible), .reveal-stagger > *:not(.visible)').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [photos])

  // Hero parallax
  useEffect(() => {
    const bg = heroBgRef.current
    if (!bg) return
    setTimeout(() => bg.classList.add('loaded'), 100)
    const onScroll = () => {
      if (window.scrollY > window.innerHeight) return
      bg.style.transform = `scale(1) translateY(${window.scrollY * 0.12}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span className="ticker-item" key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <div className="home-grid">
        <div
          ref={heroBgRef}
          className="home-hero-bg"
          style={{ backgroundImage: "url('/Accueil.png')" }}
        />
        <div className="home-hero-overlay" />
        <div className="home-left">
          <img className="hero-assoc-logo" src="/Logo_Medina_Wiratha.png" alt="Medina Wiratha" />
          <div className="sec-eyebrow">Une initiative de l'association Medina Wiratha</div>
          <div className="hero-title">
            <div className="hero-title-top">Musée</div>
            <div className="hero-title-de-la">de la</div>
            <div className="hero-title-photo">Photo</div>
            <div className="hero-title-moroni">Moroni</div>
          </div>
          <p className="home-desc">Plateforme de préservation et de valorisation du patrimoine photographique des Comores. Des images qui racontent une civilisation insulaire unique, de 1880 à aujourd'hui.</p>
          <div className="home-cta-row">
            <Link className="btn-solid" href="/collections"><span>Explorer les archives</span></Link>
            <Link className="btn-outline-light" href="/about">Découvrir le musée</Link>
          </div>
          <div className="hero-scroll-cue">
            <span>Défiler</span>
            <div className="hero-scroll-arrow" />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="home-info-strip reveal-stagger">
        <div className="home-info-strip-item reveal">
          <div className="home-info-strip-n">{total.toLocaleString('fr-FR')}</div>
          <div className="home-info-strip-l">Photographies archivées</div>
        </div>
        <div className="home-info-strip-item reveal">
          <div className="home-info-strip-n">1880</div>
          <div className="home-info-strip-l">Archive la plus ancienne</div>
        </div>
        <div className="home-info-strip-item reveal">
          <div className="home-info-strip-n">2</div>
          <div className="home-info-strip-l">Îles documentées</div>
        </div>
      </div>

      {/* PARCOURS */}
      <div className="island-section">
        <div className="island-section-hd">
          <div className="island-hd-label">Parcours</div>
          <div className="island-hd-text">
            <div className="island-hd-title">Explorer les archives</div>
            <Link className="btn-outline-dark" href="/collections">Accéder aux collections →</Link>
          </div>
        </div>
        <div className="parcours-grid reveal-stagger">
          <Link className="parcours-card reveal" href="/collections?tab=periode">
            <div className="parcours-card-img" style={{ backgroundImage: "url('/Accueil.png')" }} />
            <div className="parcours-photo-label">Sultanats · Coloniale · Indépendance</div>
            <div className="parcours-card-body">
              <div className="parcours-card-n">Parcours 01 / 02</div>
              <div className="parcours-card-name">Par Période</div>
              <div className="parcours-card-sub">Sultanats · Époque Coloniale · Post-Indépendance<br />1880 — 1995</div>
              <span className="parcours-card-cta">Explorer la chronologie <span>→</span></span>
            </div>
          </Link>
          <Link className="parcours-card reveal" href="/collections?tab=auteurs">
            <div className="parcours-card-img" style={{ backgroundImage: "url('/Ngazidja.png')" }} />
            <div className="parcours-photo-label">Humblot · CNDRS · Anonymes</div>
            <div className="parcours-card-body">
              <div className="parcours-card-n">Parcours 02 / 02</div>
              <div className="parcours-card-name">Par Auteurs</div>
              <div className="parcours-card-sub">Photographes · Studios · Collections privées<br />6 fonds documentés</div>
              <span className="parcours-card-cta">Explorer les photographes <span>→</span></span>
            </div>
          </Link>
        </div>
      </div>

      {/* FEATURED */}
      <div className="feat-section">
        <div className="feat-hd reveal">
          <div className="feat-hd-title">Sélection du musée</div>
          <Link className="feat-hd-link" href="/collections">Parcourir la galerie →</Link>
        </div>
        <div className="photos-row reveal-stagger">
          {pub.length ? pub.map(p => (
            <PhotoCard key={p.id} photo={p} />
          )) : (
            <div style={{ padding: '2rem', fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--ink3)' }}>
              Aucune photo publiée pour le moment.
            </div>
          )}
        </div>
      </div>

      {/* ABOUT */}
      <div className="about-section reveal">
        <div className="about-text">
          <div className="about-big">Préserver<br />ce qui <span>disparaît</span></div>
          <p className="about-p">Le Musée de la Photographie de Moroni est un projet culturel initié par <strong>Médina Wiratha</strong> — association fondée en août 2024 pour protéger et valoriser le patrimoine historique de la commune de Moroni et des Comores.</p>
          <p className="about-p">Médina Wiratha, dont le nom signifie littéralement <em>« la Médina en héritage »</em>, s'inscrit dans la dynamique d'inscription des médinas comoriennes au patrimoine mondial de l'UNESCO.</p>
          <p className="about-p">Chaque image est un document historique, un témoignage irremplaçable. Nous documentons chaque photo — date, lieu, auteur, contexte — pour transmettre ce patrimoine aux générations futures.</p>
          <div className="about-logo-row">
            <img className="about-logo-img" src="/Logo_Medina_Wiratha.png" alt="Medina Wiratha" />
            <div className="about-logo-txt">Association Medina Wiratha<br />« Patrimoine de la medina »<br />Moroni, Comores · Fondée 2024</div>
          </div>
          <Link className="btn-outline-dark" style={{ marginTop: '2rem', display: 'inline-block' }} href="/about">
            Notre mission complète →
          </Link>
        </div>
        <div className="about-right">
          <div className="about-stat">
            <div className="about-stat-n">{total.toLocaleString('fr-FR')}</div>
            <div className="about-stat-l">Photographies archivées</div>
            <div className="about-stat-sub">Des tirages argentiques aux négatifs numérisés, chaque pièce cataloguée avec rigueur</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-n">1880</div>
            <div className="about-stat-l">Première archive connue</div>
            <div className="about-stat-sub">Plus d'un siècle d'histoire visuelle des Comores</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-n">{pubCount.toLocaleString('fr-FR')}</div>
            <div className="about-stat-l">Photos publiées</div>
            <div className="about-stat-sub">Accessibles au public, documentées et contextualisées</div>
          </div>
        </div>
      </div>
    </>
  )
}