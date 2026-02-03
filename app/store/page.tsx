import { getArtworks } from '@/app/actions/artworks'
import { StoreGrid } from '@/components/store/store-grid'

export default async function StorePage() {
  const artworksResult = await getArtworks({ isAvailable: true })
  const artworks = artworksResult.success ? artworksResult.data : []

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <p className="text-luxury-gold text-xs uppercase tracking-[0.3em] mb-4">The Collection</p>
          <h1 className="text-5xl md:text-6xl font-serif text-luxury-black mb-8">Available Works</h1>
          <div className="w-[1px] h-12 bg-luxury-gold mx-auto" />
        </div>

        <StoreGrid artworks={artworks} />
      </div>
    </div>
  )
}
