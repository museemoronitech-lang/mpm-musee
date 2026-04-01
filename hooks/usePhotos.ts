'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchPhotos as fetchPhotosFromDB } from '@/lib/queries'
import type { Photo } from '@/types'

export function usePhotos(initialPhotos?: Photo[]) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos || [])
  const [loading, setLoading] = useState(!initialPhotos)

  const reload = useCallback(async () => {
    setLoading(true)
    const data = await fetchPhotosFromDB()
    setPhotos(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!initialPhotos) {
      reload()
    }
  }, [initialPhotos, reload])

  const totalPhotos = photos.length
  const pubPhotos = photos.filter((p) => p.status === 'pub').length
  const draftPhotos = totalPhotos - pubPhotos
  const thisMonth = photos.filter((p) => {
    if (!p.created_at) return false
    const d = new Date(p.created_at)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return { photos, loading, reload, totalPhotos, pubPhotos, draftPhotos, thisMonth }
}
