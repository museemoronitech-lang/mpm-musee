import { fetchPhotos, fetchSetting } from '@/lib/queries'
import Ticker from '@/components/Ticker'
import HomeClient from '@/components/HomeClient'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [photos, heroAccueil, heroNgazidja] = await Promise.all([
    fetchPhotos(),
    fetchSetting('hero_accueil'),
    fetchSetting('hero_ngazidja'),
  ])

  return (
    <>
      <Ticker />
      <HomeClient
        photos={photos}
        heroAccueil={heroAccueil ?? undefined}
        heroNgazidja={heroNgazidja ?? undefined}
      />
    </>
  )
}
