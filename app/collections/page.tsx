'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchPhotos } from '@/lib/queries'
import { Photo } from '@/types'
import PeriodeSidebar from '@/components/PeriodeSidebar'
import AuthorsGrid from '@/components/AuthorsGrid'
import GroupedGrid from '@/components/GroupedGrid'
import Link from 'next/link'

type Tab = 'periode' | 'auteurs' | 'collections' | 'sources'

const SCROLL_KEY = 'mpm_collections_scroll'

export default function CollectionsPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [tab, setTab] = useState<Tab>('periode')
  const [activePeriode, setActivePeriode] = useState('sultanats')
  const [activeAuthor, setActiveAuthor] = useState('')
  const [activeCollection, setActiveCollection] = useState('')
  const [activeSource, setActiveSource] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchPhotos().then(data => {
      setPhotos(data)

      const params = new URLSearchParams(window.location.search)
      const t = params.get('tab')
      if (t === 'auteurs' || t === 'collections' || t === 'sources') setTab(t)

      // Auto-select first available author
      const firstAuthor = data.find(p => p.status === 'pub' && p.author)?.author ?? ''
      if (firstAuthor) setActiveAuthor(firstAuthor)

      // Auto-select first collection / source
      const firstCollection = data.find(p => p.status === 'pub' && p.collection)?.collection ?? ''
      if (firstCollection) setActiveCollection(firstCollection)
      const firstSource = data.find(p => p.status === 'pub' && p.source)?.source ?? ''
      if (firstSource) setActiveSource(firstSource)
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
        <p className="page-banner-sub">Archives photographiques organisées par période historique, par photographe, par collection ou par source.</p>
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
        <div
          className={`coll-tab ${tab === 'collections' ? 'active' : ''}`}
          onClick={() => setTab('collections')}
        >
          Par collection
        </div>
        <div
          className={`coll-tab ${tab === 'sources' ? 'active' : ''}`}
          onClick={() => setTab('sources')}
        >
          Par source
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
      {tab === 'collections' && (
        <GroupedGrid
          photos={photos}
          field="collection"
          active={activeCollection}
          onSelect={setActiveCollection}
          onPhotoClick={handlePhotoClick}
        />
      )}
      {tab === 'sources' && (
        <GroupedGrid
          photos={photos}
          field="source"
          active={activeSource}
          onSelect={setActiveSource}
          onPhotoClick={handlePhotoClick}
        />
      )}
    </div>
  )
}