import { getArtists } from '@/app/actions/artists'
import Image from 'next/image'
import Link from 'next/link'

export default async function ArtistsPage() {
  const artistsResult = await getArtists('APPROVED')
  const artists = artistsResult.success ? artistsResult.data : []

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-luxury-gold text-xs uppercase tracking-[0.3em] mb-4">Meet the Creators</p>
          <h1 className="text-5xl md:text-6xl font-serif text-luxury-black mb-8">Featured Artists</h1>
          <div className="w-[1px] h-12 bg-luxury-gold mx-auto" />
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.slug}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden bg-luxury-cream mb-6">
                {artist.profileImageUrl ? (
                  <Image
                    src={artist.profileImageUrl}
                    alt={artist.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-luxury-gold/20 to-luxury-cream">
                    <span className="text-6xl font-serif text-luxury-black/20">
                      {artist.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-serif text-luxury-black mb-2 group-hover:text-luxury-gold transition-colors">
                {artist.name}
              </h3>
              <p className="text-sm text-luxury-gray line-clamp-3 leading-relaxed">
                {artist.bio}
              </p>
              <div className="mt-4 flex items-center text-xs uppercase tracking-widest text-luxury-gold group-hover:text-luxury-black transition-colors">
                View Portfolio →
              </div>
            </Link>
          ))}
        </div>

        {artists.length === 0 && (
          <div className="text-center py-24 text-luxury-gray">
            <p>No artists available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
