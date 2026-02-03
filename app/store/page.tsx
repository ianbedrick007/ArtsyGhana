import { getArtworks } from '@/app/actions/artworks'
import { StoreGrid } from '@/components/store/store-grid'
import { Footer } from '@/components/footer'

export default async function StorePage() {
  const artworksResult = await getArtworks({ isAvailable: true })
  const artworks = artworksResult.success ? artworksResult.data : []

  return (
    <div className="min-h-screen bg-dark-white pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-b from-[#8D6B3B] to-[#8D6B3B]/90 text-white py-16 px-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif mb-4">Art Store</h1>
            <p className="text-lg text-warm-gray">
              Explore our curated collection of original artwork from Ghana's finest artists.
            </p>
          </div>
        </div>

        <div className="flex gap-12">
          <StoreGrid artworks={artworks} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
