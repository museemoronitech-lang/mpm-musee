'use client'

import { PERIODES_DATA, PERIODE_MAP } from '@/lib/data'
import type { Photo } from '@/types'
import ScrollReveal from '@/components/ScrollReveal'

interface PeriodeSidebarProps {
  activePeriode: string
  onSelect: (id: string) => void
  photos: Photo[]
  onPhotoClick: (id: string) => void
}

const SIDEBAR_ITEMS = [
  { id: 'sultanats', dates: 'Avant 1912', name: 'Sultanats' },
  { id: 'coloniale', dates: '1912 — 1975', name: 'Période Coloniale' },
  { id: 'independance', dates: '1975 — 1995', name: 'Post-Indépendance' },
]

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

export default function PeriodeSidebar({
  activePeriode,
  onSelect,
  photos,
  onPhotoClick,
}: PeriodeSidebarProps) {
  const pub = photos.filter((p) => p.status === 'pub')

  const getCount = (id: string) => {
    const periodeKey = PERIODE_MAP[id]
    return pub.filter((p) => p.periode === periodeKey).length
  }

  const periodeData = PERIODES_DATA[activePeriode]
  const periodeKey = PERIODE_MAP[activePeriode]
  const periodePhotos = photos.filter(
    (p) => p.status === 'pub' && p.periode === periodeKey && p.image_url
  )

  return (
    <div className="periode-grid">
      <div className="periode-sidebar">
        {SIDEBAR_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`periode-sb-item${activePeriode === item.id ? ' active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <div className="periode-sb-dates">{item.dates}</div>
            <div className="periode-sb-name">{item.name}</div>
            <div className="periode-sb-count">
              {getCount(item.id)} photographie{getCount(item.id) > 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>
      <div className="periode-content">
        {periodeData && (
          <>
            <ScrollReveal>
              <div className="periode-kicker">{periodeData.kicker}</div>
            </ScrollReveal>
            <ScrollReveal>
              <div className="periode-title">{periodeData.title}</div>
            </ScrollReveal>
            <ScrollReveal>
              <p className="periode-desc">{periodeData.desc}</p>
            </ScrollReveal>

            {periodePhotos.length > 0 ? (
              <ScrollReveal variant="reveal-stagger">
                <div className="periode-photos-grid">
                  {periodePhotos.map((p, i) => (
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
              </ScrollReveal>
            ) : (
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '0.7rem',
                  color: 'var(--ink3)',
                  padding: '1rem 0',
                }}
              >
                Aucune photographie publiée pour cette période.
              </div>
            )}

            {periodeData.sub.length > 0 && (
              <ScrollReveal>
                <div className="periode-sub-items">
                  {periodeData.sub.map((s) => (
                    <div className="periode-sub" key={s.name}>
                      <div className="periode-sub-name">{s.name}</div>
                      <div className="periode-sub-meta">{s.meta}</div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </>
        )}
      </div>
    </div>
  )
}
