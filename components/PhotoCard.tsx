'use client'

import Link from 'next/link'
import type { Photo } from '@/types'

interface PhotoCardProps {
  photo: Photo
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <Link className="prow-item photo-hover-wrap" href={`/photo/${photo.id}`}>
      <div
        className="prow-img"
        style={{ backgroundImage: `url('${photo.image_url}')` }}
      />
      <div className="prow-info">
        <div className="prow-yr">
          {photo.date_approx} · {photo.periode || ''}
        </div>
        <div className="prow-title">{photo.title}</div>
        {photo.author && <div className="prow-isle">{photo.author}</div>}
      </div>
      <div className="phv-label">Voir la photo</div>
    </Link>
  )
}
