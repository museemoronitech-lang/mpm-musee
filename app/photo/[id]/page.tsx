import { notFound } from 'next/navigation'
import { fetchPhotoById, fetchPhotosByPeriode } from '@/lib/queries'
import PhotoPageClient from './PhotoPageClient'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const photo = await fetchPhotoById(id)
  if (!photo) return { title: 'Photo — MPM' }
  return {
    title: `${photo.title} — MPM`,
    description: photo.context || `${photo.date_approx} · ${photo.periode}`,
  }
}

export default async function PhotoPage({ params }: Props) {
  const { id } = await params
  const photo = await fetchPhotoById(id)
  if (!photo) notFound()

  const siblings = photo.periode
    ? await fetchPhotosByPeriode(photo.periode)
    : []

  const idx = siblings.findIndex(p => p.id === photo.id)
  const prev = idx > 0 ? siblings[idx - 1] : null
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null
  const position = idx >= 0 ? { current: idx + 1, total: siblings.length } : null

  return (
    <PhotoPageClient
      photo={photo}
      prev={prev}
      next={next}
      position={position}
    />
  )
}
