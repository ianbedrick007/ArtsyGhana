import { getArtworks } from '@/app/actions/artworks'
import { StoreGrid } from '@/components/store/store-grid'
import { Footer } from '@/components/footer'

export default async function StorePage() {
  const artworksResult = await getArtworks({ isAvailable: true })
  const artworks = artworksResult.success ? artworksResult.data : []

  return (
    <div className="min-h-screen bg-dark-white pt-16 sm:pt-20 pb-12 sm:pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-b from-[#8D6B3B] to-[#8D6B3B]/90 text-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 mb-8 sm:mb-10 md:mb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-3 sm:mb-4">Art Store</h1>
            <p className="text-base sm:text-lg text-warm-gray">
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
