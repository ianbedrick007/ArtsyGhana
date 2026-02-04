import { getArtworks } from '@/app/actions/artworks'
import { Footer } from '@/components/footer'
import { ArtworkImage } from '@/components/artwork-image'
import Link from 'next/link'

export default async function GalleryPage() {
  const artworksResult = await getArtworks({ isAvailable: true })
  const artworks = artworksResult.success ? artworksResult.data : []

  // Take first 9 artworks for 3x3 grid
  const featuredArtworks = artworks.slice(0, 9)

  return (
    <div className="min-h-screen bg-dark-white pt-16 sm:pt-20 pb-12 sm:pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal mb-3 sm:mb-4">Featured Curation</h1>
          <p className="text-base sm:text-lg text-warm-gray">
            Exceptional pieces from Ghana's finest contemporary artists.
          </p>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {featuredArtworks.map((artwork) => (
            <Link
              key={artwork.id}
              href={`/store/${artwork.slug}`}
              className="group relative aspect-[4/5] overflow-hidden bg-dark-white"
            >
              {artwork.imageUrl ? (
                <ArtworkImage
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  title={artwork.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burnished-gold/20 to-dark-white">
                  <span className="text-4xl font-serif text-charcoal/20">{artwork.title.charAt(0)}</span>
                </div>
              )}
            </Link>
          ))}
        </div>

        {featuredArtworks.length === 0 && (
          <div className="text-center py-24 text-warm-gray">
            <p>No artworks available at the moment.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
