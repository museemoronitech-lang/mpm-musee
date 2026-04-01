'use client'

import { useState } from 'react'
import type { Photo } from '@/types'

interface PhotoDetailProps {
  photo: Photo
  onClose: () => void
}

export default function PhotoDetail({ photo, onClose }: PhotoDetailProps) {
  const [zoomed, setZoomed] = useState(false)

  const metaRows = [
    ['Date', photo.date_approx],
    ['Période', photo.periode],
    ['Photographe', photo.author || 'Anonyme'],
    ['Référence', photo.ref_code],
  ].filter(([, v]) => v && v !== '—')

  const tags = [photo.periode, photo.author, photo.date_approx].filter(Boolean)

  return (
    <div id="photo-detail-section" className="visible" style={{ paddingTop: '52px' }}>
      <div className="ctx-back-bar">
        <button className="ctx-back-btn" onClick={onClose}>
          <span>←</span> Collections
        </button>
        <span className="ctx-back-crumb">{photo.title}</span>
      </div>
      <div className="photo-detail-layout" style={{ paddingTop: 0 }}>
        <div className="ph-stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={`ph-main-img${zoomed ? ' zoomed' : ''}`}
            src={photo.image_url}
            alt={photo.title}
            onClick={() => setZoomed(!zoomed)}
          />
          <div className="ph-stage-ctrls">
            <button className="ph-ctrl-btn" onClick={() => setZoomed(!zoomed)}>⊕</button>
            <button className="ph-ctrl-btn" onClick={() => window.open(photo.image_url, '_blank')}>⛶</button>
            <button className="ph-ctrl-btn" onClick={() => window.open(photo.image_url, '_blank')}>↓</button>
          </div>
        </div>
        <div className="ph-panel">
          <div className="ph-panel-top">
            <button className="ph-panel-back" onClick={onClose}>← Collections</button>
            <div className="ph-panel-title">{photo.title}</div>
          </div>
          <div className="ph-meta-block">
            {metaRows.map(([key, val]) => (
              <div className="ph-meta-row" key={key}>
                <span className="ph-meta-key">{key}</span>
                <span className="ph-meta-val">{val}</span>
              </div>
            ))}
          </div>
          {photo.context && (
            <div className="ph-ctx-block">
              <div className="ph-ctx-label">Contexte historique</div>
              <p className="ph-ctx-p">{photo.context}</p>
            </div>
          )}
          <div className="ph-tags-block">
            {tags.map((t) => (
              <div className="ph-tag" key={t}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
