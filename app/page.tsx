import { getFeaturedArtworks } from '@/app/actions/artworks'
import { getCurrentExhibition } from '@/app/actions/exhibitions'
import { HeroSection } from '@/components/home/hero-section'
import { ArtCard } from '@/components/artworks/art-card'

export default async function Home() {
  // Fetch data from database
  const featuredArtworksResult = await getFeaturedArtworks(6)
  const currentExhibitionResult = await getCurrentExhibition()

  const featuredProducts = featuredArtworksResult.success ? featuredArtworksResult.data : []
  const currentExhibition = currentExhibitionResult.success ? currentExhibitionResult.data : null

  return (
    <div className="relative">
      {/* Hero Section with video */}
      <HeroSection />

      {/* Featured Artwork Section */}
      <section id="collections" className="bg-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div>
              <p className="text-luxury-gold text-xs uppercase tracking-widest mb-4">Curated Spotlight</p>
              <h2 className="text-5xl font-serif text-luxury-black">Current Acquisitions</h2>
            </div>
            <a href="/store" className="text-xs uppercase tracking-widest text-luxury-gray hover:text-luxury-gold transition-colors">
              View Entire Catalog ↗
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((artwork) => (
                <ArtCard key={artwork.id} artwork={artwork} />
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-luxury-gray">
                <p>No featured artworks available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-luxury-cream py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif mb-12 italic text-luxury-black">
            "Art is the only way to run away without leaving home."
          </h2>
          <p className="text-xl text-luxury-gray leading-relaxed mb-16">
            Our mission is to democratize the luxury of Ghanaian art. By leveraging spatial computing and local
            craftsmanship, we ensure that the stories of our ancestors are preserved in a medium that speaks to the future.
          </p>
          <div className="grid grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-3xl font-serif text-luxury-black mb-2">12+</div>
              <div className="text-[10px] uppercase tracking-widest text-luxury-gold">Active Artists</div>
            </div>
            <div>
              <div className="text-3xl font-serif text-luxury-black mb-2">350</div>
              <div className="text-[10px] uppercase tracking-widest text-luxury-gold">Pieces Curated</div>
            </div>
            <div>
              <div className="text-3xl font-serif text-luxury-black mb-2">5</div>
              <div className="text-[10px] uppercase tracking-widest text-luxury-gold">Global Galleries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-luxury-black py-24 px-8 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-serif mb-8">Join the Inner Circle</h3>
          <p className="text-gray-400 mb-12 text-sm uppercase tracking-widest">
            Receive private invites to new exhibition launches.
          </p>
          <div className="flex border-b border-gray-700 pb-2">
            <input
              type="email"
              placeholder="Your Email Address"
              className="bg-transparent flex-grow px-4 py-2 focus:outline-none text-sm font-light tracking-wide"
            />
            <button className="text-xs uppercase tracking-widest text-luxury-gold hover:text-white transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-luxury-black py-12 px-8 border-t border-gray-800 text-gray-500 text-[10px] uppercase tracking-[0.3em] flex justify-between items-center">
        <div>© 2024 ArtsyGhana. Accra.</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">
            Instagram
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Artsy
          </a>
        </div>
      </footer>
    </div>
  )
}
