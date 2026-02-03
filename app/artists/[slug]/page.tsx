import { getArtistBySlug } from '@/app/actions/artists'
import { ArtCard } from '@/components/artworks/art-card'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function ArtistDetailPage({ params }: { params: { slug: string } }) {
  const artistResult = await getArtistBySlug(params.slug)

  if (!artistResult.success || !artistResult.data) {
    notFound()
  }

  const artist = artistResult.data

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      {/* Artist Header */}
      <section className="px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square overflow-hidden bg-luxury-cream">
              {artist.profileImageUrl ? (
                <Image
                  src={artist.profileImageUrl}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-luxury-gold/20 to-luxury-cream">
                  <span className="text-9xl font-serif text-luxury-black/20">
                    {artist.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div>
              <p className="text-luxury-gold text-xs uppercase tracking-[0.3em] mb-4">Artist</p>
              <h1 className="text-5xl md:text-6xl font-serif text-luxury-black mb-6">{artist.name}</h1>
              
              <div className="space-y-4 mb-8">
                <p className="text-lg text-luxury-gray leading-relaxed">{artist.bio}</p>
                {artist.statement && (
                  <p className="text-base text-luxury-gray leading-relaxed italic border-l-2 border-luxury-gold pl-4">
                    {artist.statement}
                  </p>
                )}
              </div>

              <div className="flex gap-6 text-sm">
                {artist.website && (
                  <a
                    href={artist.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-luxury-gray hover:text-luxury-gold transition-colors uppercase tracking-widest"
                  >
                    Website ↗
                  </a>
                )}
                {artist.instagramHandle && (
                  <a
                    href={`https://instagram.com/${artist.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-luxury-gray hover:text-luxury-gold transition-colors uppercase tracking-widest"
                  >
                    Instagram ↗
                  </a>
                )}
                {artist.portfolioUrl && (
                  <a
                    href={artist.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-luxury-gray hover:text-luxury-gold transition-colors uppercase tracking-widest"
                  >
                    Portfolio ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artist's Artworks */}
      <section className="px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-serif text-luxury-black mb-2">Available Works</h2>
            <div className="w-16 h-[2px] bg-luxury-gold" />
          </div>

          {artist.artworks && artist.artworks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {artist.artworks.map((artwork) => (
                <ArtCard
                  key={artwork.id}
                  artwork={{
                    ...artwork,
                    artist: {
                      name: artist.name,
                      slug: artist.slug,
                    },
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-luxury-gray">
              <p>No artworks available from this artist at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Back Link */}
      <div className="px-8 mt-16">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/artists"
            className="inline-flex items-center text-sm uppercase tracking-widest text-luxury-gray hover:text-luxury-gold transition-colors"
          >
            ← Back to Artists
          </Link>
        </div>
      </div>
    </div>
  )
}
