import { Footer } from '@/components/footer'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Mock spotlight articles - in production, these would come from a database
const spotlightArticles = [
  {
    slug: 'reimagining-tradition',
    title: 'Reimagining Tradition Through Modern Eyes',
    description: 'A deep dive into how traditional Ghanaian motifs are being transformed by contemporary artists pushing boundaries while honoring their heritage.',
    image: '/images/placeholder.jpg',
  },
  {
    slug: 'rise-of-female-artists',
    title: 'The Rise of Female Artists in Accra',
    description: 'Exploring the vibrant work of female artists and what it means to be a Ghanaian artist in the 21st century.',
    image: '/images/placeholder.jpg',
  },
  {
    slug: 'sculptural-narratives',
    title: 'Sculptural Narratives: Stories in Bronze',
    description: 'Exploring the ancient craft of bronze casting and its evolution in contemporary Ghanaian sculpture.',
    image: '/images/placeholder.jpg',
  },
  {
    slug: 'contemporary-expressions',
    title: 'Contemporary Expressions of Cultural Identity',
    description: 'How today\'s artists are redefining what it means to create art that speaks to both local and global audiences.',
    image: '/images/placeholder.jpg',
  },
]

export default function SpotlightPage() {
  return (
    <div className="min-h-screen bg-dark-white pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif text-charcoal mb-4">Artist Spotlight</h1>
          <p className="text-lg text-warm-gray max-w-2xl mx-auto">
            In-depth stories and conversations with Ghana's leading creative voices.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {spotlightArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-light-grey mb-6">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <h2 className="text-2xl font-serif text-charcoal mb-3 group-hover:text-burnished-gold transition-colors">
                {article.title}
              </h2>
              <p className="text-warm-gray leading-relaxed mb-4">
                {article.description}
              </p>
              <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-burnished-gold group-hover:gap-4 transition-all">
                <span>Read Story</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
