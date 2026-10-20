'use client'

import { useMemo } from 'react'
import { Photo } from '@/types'

interface GroupedGridProps {
  photos: Photo[]
  field: 'collection' | 'source'
  active: string
  onSelect: (value: string) => void
  onPhotoClick: (id: string) => void
}

const LABELS = {
  collection: { title: 'Collection', empty: 'Aucune collection renseignée pour le moment.' },
  source: { title: 'Source', empty: 'Aucune source renseignée pour le moment.' },
}

export default function GroupedGrid({ photos, field, active, onSelect, onPhotoClick }: GroupedGridProps) {
  const pub = useMemo(() => photos.filter((p) => p.status === 'pub' && p.image_url), [photos])

  // Regroupe les photos publiées par valeur du champ (collection ou source)
  const groups = useMemo(() => {
    const map = new Map<string, Photo[]>()
    pub.forEach((p) => {
      const v = (p[field] || '').trim()
      if (!v) return
      map.set(v, [...(map.get(v) || []), p])
    })
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], 'fr'))
  }, [pub, field])

  const current = groups.find(([name]) => name === active) ?? groups[0]
  const currentName = current?.[0]
  const currentPhotos = current?.[1] ?? []

  if (!groups.length) {
    return (
      <div style={{ padding: '3rem 1.5rem', fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--ink3)' }}>
        {LABELS[field].empty}
      </div>
    )
  }

  return (
    <div className="gg-wrap">
      <style>{`
        .gg-wrap { display: flex; gap: 2rem; padding: 2rem 1.5rem 4rem; align-items: flex-start; }
        .gg-list { flex: 0 0 240px; display: flex; flex-direction: column; gap: 0.25rem; position: sticky; top: 70px; max-height: calc(100vh - 100px); overflow-y: auto; }
        .gg-item {
          display: flex; justify-content: space-between; gap: 0.6rem; text-align: left;
          padding: 0.6rem 0.8rem; background: none; border: 1px solid transparent; cursor: pointer;
          font-family: var(--serif); font-size: 0.9rem; color: var(--ink2);
        }
        .gg-item:hover { border-color: var(--cr3, #ddd); }
        .gg-item.active { background: var(--ink); color: var(--cr); }
        .gg-count { font-family: var(--mono); font-size: 0.58rem; opacity: 0.6; align-self: center; }
        .gg-main { flex: 1; min-width: 0; }
        .gg-title { font-family: var(--serif); font-size: 1.5rem; color: var(--ink); margin: 0 0 0.3rem; }
        .gg-sub { font-family: var(--mono); font-size: 0.6rem; color: var(--ink3); margin-bottom: 1.4rem; }
        .gg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 1rem; }
        .gg-card { cursor: pointer; background: none; border: none; padding: 0; text-align: left; }
        .gg-img { aspect-ratio: 4 / 5; background-size: cover; background-position: center; background-color: var(--cr3, #ddd); transition: opacity .2s; }
        .gg-card:hover .gg-img { opacity: 0.85; }
        .gg-cap { font-family: var(--serif); font-size: 0.8rem; color: var(--ink); margin-top: 0.45rem; line-height: 1.3; }
        .gg-meta { font-family: var(--mono); font-size: 0.55rem; color: var(--ink3); margin-top: 0.15rem; }
        @media (max-width: 800px) {
          .gg-wrap { flex-direction: column; gap: 1.2rem; padding: 1.2rem 1rem 3rem; }
          .gg-list { flex: none; width: 100%; position: static; max-height: none; flex-direction: row; overflow-x: auto; overflow-y: hidden; padding-bottom: 0.3rem; }
          .gg-item { flex: 0 0 auto; white-space: nowrap; border-color: var(--cr3, #ddd); }
          .gg-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.7rem; }
        }
      `}</style>

      <div className="gg-list">
        {groups.map(([name, list]) => (
          <button
            key={name}
            className={`gg-item ${name === currentName ? 'active' : ''}`}
            onClick={() => onSelect(name)}
          >
            <span>{name}</span>
            <span className="gg-count">{list.length}</span>
          </button>
        ))}
      </div>

      <div className="gg-main">
        <h2 className="gg-title">{currentName}</h2>
        <div className="gg-sub">
          {LABELS[field].title} · {currentPhotos.length} photo{currentPhotos.length > 1 ? 's' : ''}
        </div>
        <div className="gg-grid">
          {currentPhotos.map((p) => (
            <button key={p.id} className="gg-card" onClick={() => onPhotoClick(p.id)}>
              <div className="gg-img" style={{ backgroundImage: `url('${p.image_url}')` }} />
              <div className="gg-cap">{p.title}</div>
              <div className="gg-meta">
                {[p.author, p.date_approx].filter(Boolean).join(' · ')}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
