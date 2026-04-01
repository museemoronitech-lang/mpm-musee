'use client'

import { AUTHORS_DATA } from '@/lib/data'
import type { Photo } from '@/types'
import ScrollReveal from '@/components/ScrollReveal'

interface AuthorsGridProps {
  photos: Photo[]
}

export default function AuthorsGrid({ photos }: AuthorsGridProps) {
  return (
    <>
      <div className="photo-authors-banner">
        <div className="photo-authors-banner-h">Fonds d&apos;Auteurs</div>
        <p className="photo-authors-banner-p">
          Explorez les archives par photographe. Des missionnaires du XIXe siècle aux studios locaux du XXe.
        </p>
      </div>
      <div className="authors-grid">
        {AUTHORS_DATA.map((a) => {
          const photo = photos.find(
            (p) =>
              p.status === 'pub' &&
              p.author &&
              p.author.toLowerCase().includes(a.name.split(' ').pop()!.toLowerCase()) &&
              p.image_url
          )
          const bg = photo ? `url('${photo.image_url}')` : 'none'

          return (
            <ScrollReveal key={a.id} className="author-card">
              <div
                className="author-card-img"
                style={{ backgroundImage: bg, backgroundColor: 'var(--ink2)' }}
              />
              <div className="author-card-body">
                <div className="author-card-kicker">Photographe · {a.periode}</div>
                <div className="author-card-name">{a.name}</div>
                <div className="author-card-dates">{a.dates}</div>
                <div className="author-card-count">{a.count}</div>
                <div className="author-card-cta">
                  Explorer le fonds <span>→</span>
                </div>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </>
  )
}
