'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchPhotos } from '@/lib/queries'
import { Photo } from '@/types'
import PeriodeSidebar from '@/components/PeriodeSidebar'
import AuthorsGrid from '@/components/AuthorsGrid'
import Link from 'next/link'

const SCROLL_KEY = 'mpm_collections_scroll'

export default function CollectionsPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [tab, setTab] = useState<'periode' | 'auteurs'>('periode')
  const [activePeriode, setActivePeriode] = useState('sultanats')
  const [activeAuthor, setActiveAuthor] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchPhotos().then(data => {
      setPhotos(data)

      const params = new URLSearchParams(window.location.search)
      if (params.get('tab') === 'auteurs') setTab('auteurs')

      // Auto-select first available author
      const firstAuthor = data.find(p => p.status === 'pub' && p.author)?.author ?? ''
      if (firstAuthor) setActiveAuthor(firstAuthor)
    })

    // Restore scroll position coming back from photo page
    const savedScroll = sessionStorage.getItem(SCROLL_KEY)
    if (savedScroll) {
      const y = parseInt(savedScroll, 10)
      sessionStorage.removeItem(SCROLL_KEY)
      requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' }))
    }
  }, [])

  const handlePhotoClick = (id: string) => {
    sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
    router.push(`/photo/${id}`)
  }

  return (
    <div style={{ paddingTop: '52px' }}>
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
  )
}
