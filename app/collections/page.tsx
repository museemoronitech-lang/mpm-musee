'use client'

import { useEffect, useState } from 'react'
import { fetchPhotos } from '@/lib/queries'
import { Photo } from '@/types'
import PeriodeSidebar from '@/components/PeriodeSidebar'
import AuthorsGrid from '@/components/AuthorsGrid'
import PhotoDetail from '@/components/PhotoDetail'
import Link from 'next/link'

export default function CollectionsPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [tab, setTab] = useState<'periode' | 'auteurs'>('periode')
  const [activePeriode, setActivePeriode] = useState('sultanats')
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [activeAuthor, setActiveAuthor] = useState('')

  useEffect(() => {
    fetchPhotos().then(data => {
      setPhotos(data)
      const params = new URLSearchParams(window.location.search)
      if (params.get('tab') === 'auteurs') setTab('auteurs')
      const photoId = params.get('photo')
      if (photoId) {
        const found = data.find(p => p.id === photoId)
        if (found) setSelectedPhoto(found)
      }
      // Auto-select first author from DB data
      const firstAuthor = data.find(p => p.status === 'pub' && p.author)?.author ?? ''
      if (firstAuthor) setActiveAuthor(firstAuthor)
    })
  }, [])

  const handlePhotoClick = (id: string) => {
    const found = photos.find(p => p.id === id)
    if (found) setSelectedPhoto(found)
  }

  return (
    <div style={{ paddingTop: '52px' }}>
      {selectedPhoto && (
        <PhotoDetail photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
      <div id="collections-main" className={selectedPhoto ? 'hidden' : ''}>
        <div className="ctx-back-bar">
          <Link className="ctx-back-btn" href="/">← Accueil</Link>
          <span className="ctx-back-crumb">Collections</span>
        </div>
        <div className="page-banner">
          <div className="page-banner-h1">Collections</div>
          <p className="page-banner-sub">Archives photographiques organisées par période historique ou par photographe.</p>
        </div>
        <div className="coll-tabs">
          <div
            className={`coll-tab ${tab === 'periode' ? 'active' : ''}`}
            onClick={() => setTab('periode')}
          >
            Par période historique
          </div>
          <div
            className={`coll-tab ${tab === 'auteurs' ? 'active' : ''}`}
            onClick={() => setTab('auteurs')}
          >
            Par photographe
          </div>
        </div>
        {tab === 'periode' && (
          <PeriodeSidebar
            photos={photos}
            activePeriode={activePeriode}
            onSelect={setActivePeriode}
            onPhotoClick={handlePhotoClick}
          />
        )}
        {tab === 'auteurs' && (
          <AuthorsGrid
            photos={photos}
            activeAuthor={activeAuthor}
            onAuthorSelect={setActiveAuthor}
            onPhotoClick={handlePhotoClick}
          />
        )}
      </div>
    </div>
  )
}
