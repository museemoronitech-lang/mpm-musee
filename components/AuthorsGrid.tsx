'use client'

import { useEffect, useRef } from 'react'
import type { Photo } from '@/types'

interface AuthorsGridProps {
  photos: Photo[]
  activeAuthor: string
  onAuthorSelect: (author: string) => void
  onPhotoClick: (id: string) => void
}

const numStyle: React.CSSProperties = {
  position: 'absolute',
  top: '0.5rem',
  left: '0.5rem',
  background: 'rgba(26,22,20,0.72)',
  color: 'var(--cr)',
  fontFamily: 'var(--mono)',
  fontSize: '0.5rem',
  letterSpacing: '0.12em',
  padding: '0.18rem 0.42rem',
  zIndex: 2,
  pointerEvents: 'none',
}

export default function AuthorsGrid({ photos, activeAuthor, onAuthorSelect, onPhotoClick }: AuthorsGridProps) {
  const pub = photos.filter(p => p.status === 'pub')
  const photosSectionRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (activeAuthor && photosSectionRef.current) {
      photosSectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeAuthor])

  // Derive unique authors from actual DB photos
  const authors = Array.from(new Set(pub.filter(p => p.author).map(p => p.author))).sort()

  const authorPhotos = pub.filter(p => p.author === activeAuthor && !!p.image_url)

  return (
    <>
      <div className="photo-authors-banner">
        <div className="photo-authors-banner-h">Fonds d&apos;Auteurs</div>
        <p className="photo-authors-banner-p">
          Explorez les archives par photographe. Des missionnaires du XIXe siècle aux studios locaux du XXe.
        </p>
      </div>

      {authors.length === 0 ? (
        <div style={{ padding: '2rem 3rem', fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--ink3)' }}>
          Aucun photographe documenté pour le moment.
        </div>
      ) : (
        <>
          {/* Author selection grid */}
          <div className="authors-grid">
            {authors.map((author) => {
              const repPhoto = pub.find(p => p.author === author && p.image_url)
              const count = pub.filter(p => p.author === author).length
              const isActive = author === activeAuthor

              return (
                <div
                  key={author}
                  className="author-card"
                  style={isActive ? { outline: '3px solid var(--rust)' } : undefined}
                  onClick={() => onAuthorSelect(author)}
                >
                  <div
                    className="author-card-img"
                    style={{
                      backgroundImage: repPhoto ? `url('${repPhoto.image_url}')` : undefined,
                      backgroundColor: 'var(--ink2)',
                    }}
                  />
                  <div className="author-card-body">
                    <div className="author-card-kicker">Photographe</div>
                    <div className="author-card-name">{author}</div>
                    <div className="author-card-count">{count} photographie{count > 1 ? 's' : ''}</div>
                    <div className="author-card-cta">
                      Explorer le fonds <span>→</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Photos for selected author */}
          {activeAuthor && (
            <div ref={photosSectionRef} style={{ padding: '2rem 3rem', borderTop: '2px solid var(--ink)' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ display: 'block', width: '20px', height: '1px', background: 'var(--rust)' }} />
                {activeAuthor} — {authorPhotos.length} photographie{authorPhotos.length > 1 ? 's' : ''}
              </div>
              {authorPhotos.length > 0 ? (
                <div className="periode-photos-grid">
                  {authorPhotos.map((p, i) => (
                    <div
                      key={p.id}
                      className="periode-photo-cell photo-hover-wrap"
                      style={i === 0 ? { gridColumn: '1/3' } : undefined}
                      onClick={() => onPhotoClick(p.id)}
                    >
                      <span style={numStyle}>{String(i + 1).padStart(2, '0')}</span>
                      <div
                        className="periode-photo-img"
                        style={{ backgroundImage: `url('${p.image_url}')` }}
                      />
                      <div className="periode-photo-cap">{p.title}</div>
                      <div className="phv-label">Voir la photo</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--ink3)' }}>
                  Aucune photographie pour cet auteur.
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}
