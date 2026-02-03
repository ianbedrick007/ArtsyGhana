import { getFeaturedArtworks } from '@/app/actions/artworks'
import { getCurrentExhibition } from '@/app/actions/exhibitions'
import { getExhibitions } from '@/app/actions/exhibitions'
import { getArtists } from '@/app/actions/artists'
import { HeroSection } from '@/components/home/hero-section'
import { ArtCard } from '@/components/artworks/art-card'
import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star, Users, Palette, Award } from 'lucide-react'

export default async function Home() {
  // Fetch data from database
  const featuredArtworksResult = await getFeaturedArtworks(6)
  const currentExhibitionResult = await getCurrentExhibition()
  const exhibitionsResult = await getExhibitions('LIVE')
  const upcomingExhibitionsResult = await getExhibitions('UPCOMING')
  const artistsResult = await getArtists('APPROVED')

  const featuredProducts = featuredArtworksResult.success ? featuredArtworksResult.data : []
  const currentExhibition = currentExhibitionResult.success ? currentExhibitionResult.data : null
  const liveExhibitions = exhibitionsResult.success ? exhibitionsResult.data.slice(0, 2) : []
  const upcomingExhibitions = upcomingExhibitionsResult.success ? upcomingExhibitionsResult.data.slice(0, 1) : []
  const featuredArtists = artistsResult.success ? artistsResult.data.slice(0, 3) : []

  return (
    <div className="relative">
      {/* Hero Section with video */}
      <HeroSection />

      {/* Featured Curation Section */}
      <section id="collections" className="bg-dark-white py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-serif text-charcoal mb-4">Featured Curation</h2>
            <p className="text-warm-gray text-lg">Exceptional pieces from Ghana's finest contemporary artists.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((artwork) => (
                <ArtCard key={artwork.id} artwork={artwork} />
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-warm-gray">
                <p>No featured artworks available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      {featuredArtists.length > 0 && (
        <section className="bg-white py-24 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-serif text-charcoal mb-4">Meet Our Artists</h2>
              <p className="text-warm-gray text-lg">Discover the creative minds behind our curated collection.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {featuredArtists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.slug}`}
                  className="group text-center"
                >
                  <div className="relative aspect-square overflow-hidden bg-light-grey mb-6 rounded-lg">
                    {artist.image ? (
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burnished-gold/20 to-dark-white">
                        <span className="text-6xl font-serif text-charcoal/20">
                          {artist.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-serif text-charcoal mb-2 group-hover:text-burnished-gold transition-colors">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-warm-gray line-clamp-3 leading-relaxed">
                    {artist.bio}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-burnished-gold group-hover:gap-4 transition-all">
                    <span>View Portfolio</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/artists"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-charcoal hover:text-burnished-gold transition-colors"
              >
                View All Artists
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Current Exhibitions Section */}
      {(liveExhibitions.length > 0 || upcomingExhibitions.length > 0) && (
        <section className="bg-dark-white py-24 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-serif text-charcoal mb-4">Current Exhibitions</h2>
              <p className="text-warm-gray text-lg">Experience art in immersive virtual spaces.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {liveExhibitions.map((exhibition) => (
                <Link
                  key={exhibition.id}
                  href={`/exhibitions/${exhibition.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-light-grey mb-6 rounded-lg">
                    {exhibition.image ? (
                      <Image
                        src={exhibition.image}
                        alt={exhibition.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burnished-gold/20 to-dark-white">
                        <span className="text-4xl font-serif text-charcoal/20">Exhibition</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs uppercase tracking-wider px-3 py-1">
                      LIVE
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif text-charcoal mb-2 group-hover:text-burnished-gold transition-colors">
                    {exhibition.title}
                  </h3>
                  <p className="text-warm-gray line-clamp-2 leading-relaxed">
                    {exhibition.description}
                  </p>
                </Link>
              ))}

              {upcomingExhibitions.map((exhibition) => (
                <Link
                  key={exhibition.id}
                  href={`/exhibitions/${exhibition.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-light-grey mb-6 rounded-lg">
                    {exhibition.image ? (
                      <Image
                        src={exhibition.image}
                        alt={exhibition.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burnished-gold/20 to-dark-white">
                        <span className="text-4xl font-serif text-charcoal/20">Exhibition</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs uppercase tracking-wider px-3 py-1">
                      COMING SOON
                    </div>
                  </div>
                  <h3 className="text-2xl font-serif text-charcoal mb-2 group-hover:text-burnished-gold transition-colors">
                    {exhibition.title}
                  </h3>
                  <p className="text-warm-gray line-clamp-2 leading-relaxed">
                    {exhibition.description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/exhibitions"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-charcoal hover:text-burnished-gold transition-colors"
              >
                View All Exhibitions
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="bg-charcoal text-white py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <Users className="w-12 h-12 mx-auto mb-4 text-burnished-gold" />
              <div className="text-4xl md:text-5xl font-serif mb-2">50+</div>
              <div className="text-sm uppercase tracking-widest text-warm-gray">Active Artists</div>
            </div>
            <div>
              <Palette className="w-12 h-12 mx-auto mb-4 text-burnished-gold" />
              <div className="text-4xl md:text-5xl font-serif mb-2">500+</div>
              <div className="text-sm uppercase tracking-widest text-warm-gray">Artworks Curated</div>
            </div>
            <div>
              <Award className="w-12 h-12 mx-auto mb-4 text-burnished-gold" />
              <div className="text-4xl md:text-5xl font-serif mb-2">25+</div>
              <div className="text-sm uppercase tracking-widest text-warm-gray">Exhibitions</div>
            </div>
            <div>
              <Star className="w-12 h-12 mx-auto mb-4 text-burnished-gold" />
              <div className="text-4xl md:text-5xl font-serif mb-2">4.9</div>
              <div className="text-sm uppercase tracking-widest text-warm-gray">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-serif text-charcoal mb-4">What Collectors Say</h2>
            <p className="text-warm-gray text-lg">Hear from our community of art enthusiasts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-white p-8 rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-burnished-gold text-burnished-gold" />
                ))}
              </div>
              <p className="text-warm-gray mb-6 leading-relaxed italic">
                "ArtsyGhana has transformed how I discover and collect contemporary African art. The virtual exhibitions are breathtaking, and the authentication process gives me complete confidence in my purchases."
              </p>
              <div className="font-serif text-charcoal">Sarah Johnson</div>
              <div className="text-sm text-warm-gray">Collector, New York</div>
            </div>

            <div className="bg-dark-white p-8 rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-burnished-gold text-burnished-gold" />
                ))}
              </div>
              <p className="text-warm-gray mb-6 leading-relaxed italic">
                "As someone new to collecting art, ArtsyGhana made the process accessible and enjoyable. The artist stories and detailed descriptions help me understand each piece's cultural significance."
              </p>
              <div className="font-serif text-charcoal">Michael Chen</div>
              <div className="text-sm text-warm-gray">First-time Collector, London</div>
            </div>

            <div className="bg-dark-white p-8 rounded-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-burnished-gold text-burnished-gold" />
                ))}
              </div>
              <p className="text-warm-gray mb-6 leading-relaxed italic">
                "The quality of artwork and the seamless purchasing experience exceeded my expectations. I've built an impressive collection of Ghanaian contemporary art thanks to ArtsyGhana."
              </p>
              <div className="font-serif text-charcoal">Amina Okafor</div>
              <div className="text-sm text-warm-gray">Art Enthusiast, Lagos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#8D6B3B] text-white py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Stay Connected</h2>
          <p className="text-warm-gray text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to receive exclusive updates on new arrivals, artist features, and upcoming exhibitions.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/10 border border-white/30 px-6 py-4 text-white placeholder-warm-gray focus:outline-none focus:border-burnished-gold transition-colors"
            />
            <button
              type="submit"
              className="bg-burnished-gold text-white px-8 py-4 text-sm uppercase tracking-widest hover:bg-burnished-gold/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-warm-gray mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-dark-white py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-6">
            Ready to Start Your Collection?
          </h2>
          <p className="text-warm-gray text-lg mb-8 max-w-2xl mx-auto">
            Explore our curated gallery and discover authentic contemporary Ghanaian art that speaks to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/store"
              className="bg-charcoal text-white px-12 py-4 text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-colors inline-block"
            >
              Browse Collection
            </Link>
            <Link
              href="/gallery"
              className="bg-white border-2 border-charcoal text-charcoal px-12 py-4 text-sm uppercase tracking-widest hover:bg-charcoal hover:text-white transition-colors inline-block"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
