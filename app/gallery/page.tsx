import { getArtworks } from '@/app/actions/artworks'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'

export default async function GalleryPage() {
  const artworksResult = await getArtworks({ isAvailable: true })
  const artworks = artworksResult.success ? artworksResult.data : []

  // Take first 9 artworks for 3x3 grid
  const featuredArtworks = artworks.slice(0, 9)

  return (
    <div className="min-h-screen bg-dark-white pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif text-charcoal mb-4">Featured Curation</h1>
          <p className="text-lg text-warm-gray">
            Exceptional pieces from Ghana's finest contemporary artists.
          </p>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArtworks.map((artwork) => (
            <Link
              key={artwork.id}
              href={`/store/${artwork.slug}`}
              className="group relative aspect-[4/5] overflow-hidden bg-dark-white"
            >
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
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
