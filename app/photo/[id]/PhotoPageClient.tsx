'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Photo } from '@/types'

interface PhotoPageClientProps {
  photo: Photo
  prev: Photo | null
  next: Photo | null
  position: { current: number; total: number } | null
}

export default function PhotoPageClient({ photo, prev, next, position }: PhotoPageClientProps) {
  const [zoomed, setZoomed] = useState(false)
  const router = useRouter()

  const metaRows = [
    ['Date', photo.date_approx],
    ['Période', photo.periode],
    ['Photographe', photo.author || 'Anonyme'],
    ['Référence', photo.ref_code],
  ].filter(([, v]) => v && v !== '—')

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/collections')
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prev) router.push(`/photo/${prev.id}`)
      if (e.key === 'ArrowRight' && next) router.push(`/photo/${next.id}`)
      if (e.key === 'Escape') handleBack()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  return (
    <div className="photo-page" style={{ paddingTop: '52px' }}>

      {/* Back bar */}
      <div className="ctx-back-bar">
        <button className="ctx-back-btn" onClick={handleBack}>
          <span>←</span> Collections
        </button>
        <span className="ctx-back-crumb">{photo.ref_code}</span>
        {position && (
          <span style={{
            marginLeft: 'auto',
            fontFamily: 'var(--mono)',
            fontSize: '0.52rem',
            letterSpacing: '0.16em',
            color: 'rgba(242,237,228,0.22)',
            textTransform: 'uppercase',
          }}>
            {String(position.current).padStart(2, '0')} / {String(position.total).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* 2-column layout */}
      <div className="photo-detail-layout" style={{ paddingTop: 0 }}>

        {/* LEFT — Image */}
        <div className="ph-stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={`ph-main-img${zoomed ? ' zoomed' : ''}`}
            src={photo.image_url}
            alt={photo.title}
            onClick={() => setZoomed(z => !z)}
          />
          <div className="ph-stage-ctrls">
            <button className="ph-ctrl-btn" title="Zoom" onClick={() => setZoomed(z => !z)}>
              {zoomed ? '⊖' : '⊕'}
            </button>
            <button
              className="ph-ctrl-btn"
              title="Plein écran"
              onClick={() => window.open(photo.image_url, '_blank')}
            >
              ⛶
            </button>
            <a
              className="ph-ctrl-btn"
              href={photo.image_url}
              download
              title="Télécharger"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ↓
            </a>
          </div>
        </div>

        {/* RIGHT — Metadata panel */}
        <div className="ph-panel">

          {/* Reference + collection badge */}
          <span className="photo-page-ref">{photo.ref_code}</span>
          {photo.periode && (
            <div className="photo-collection-badge">{photo.periode}</div>
          )}

          {/* Title */}
          <div className="ph-panel-top">
            <button className="ph-panel-back" onClick={handleBack}>← Collections</button>
            <div className="ph-panel-title">{photo.title}</div>
          </div>

          {/* Metadata rows */}
          <div className="ph-meta-block">
            {metaRows.map(([key, val]) => (
              <div className="ph-meta-row" key={key}>
                <span className="ph-meta-key">{key}</span>
                <span className="ph-meta-val">{val}</span>
              </div>
            ))}
          </div>

          {/* Context */}
          {photo.context && (
            <div className="ph-ctx-block">
              <div className="ph-ctx-label">Contexte historique</div>
              <p className="ph-ctx-p">{photo.context}</p>
            </div>
          )}

          {/* Tags */}
          <div className="ph-tags-block">
            {[photo.periode, photo.author, photo.date_approx]
              .filter(Boolean)
              .map(t => (
                <div className="ph-tag" key={t}>{t}</div>
              ))}
          </div>

          {/* Prev / Next navigation */}
          <div className="photo-nav">
            {prev ? (
              <Link href={`/photo/${prev.id}`} className="photo-nav-btn">
                <div
                  className="photo-nav-thumb"
                  style={{ backgroundImage: prev.image_url ? `url('${prev.image_url}')` : undefined }}
                />
                ← Précédente
              </Link>
            ) : (
              <div className="photo-nav-btn disabled">← Précédente</div>
            )}
            {next ? (
              <Link href={`/photo/${next.id}`} className="photo-nav-btn">
                Suivante →
                <div
                  className="photo-nav-thumb"
                  style={{ backgroundImage: next.image_url ? `url('${next.image_url}')` : undefined }}
                />
              </Link>
            ) : (
              <div className="photo-nav-btn disabled">Suivante →</div>
            )}
          </div>

          {/* Keyboard hint */}
          <div style={{
            padding: '0.85rem 2rem',
            fontFamily: 'var(--mono)',
            fontSize: '0.48rem',
            letterSpacing: '0.14em',
            color: 'rgba(242,237,228,0.14)',
            textTransform: 'uppercase',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            ← → naviguer · Esc retour
          </div>

        </div>
      </div>
    </div>
  )
}
