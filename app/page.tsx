import { fetchPhotos } from '@/lib/queries'
import Ticker from '@/components/Ticker'
import HomeClient from '@/components/HomeClient'

export default async function HomePage() {
  const photos = await fetchPhotos()

  return (
    <>
      <Ticker />
      <HomeClient photos={photos} />
    </>
  )
}