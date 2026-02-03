import { getExhibitions } from '@/app/actions/exhibitions'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function ExhibitionsPage() {
  const exhibitionsResult = await getExhibitions()
  const exhibitions = exhibitionsResult.success ? exhibitionsResult.data : []

  const liveExhibitions = exhibitions.filter(e => e.status === 'LIVE')
  const upcomingExhibitions = exhibitions.filter(e => e.status === 'UPCOMING')
  const pastExhibitions = exhibitions.filter(e => e.status === 'ENDED')

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-luxury-gold text-xs uppercase tracking-[0.3em] mb-4">Virtual Experiences</p>
          <h1 className="text-5xl md:text-6xl font-serif text-luxury-black mb-8">Exhibitions</h1>
          <div className="w-[1px] h-12 bg-luxury-gold mx-auto" />
        </div>

        {/* Live Exhibitions */}
        {liveExhibitions.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-serif text-luxury-black mb-8">Live Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {liveExhibitions.map((exhibition) => (
                <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Exhibitions */}
        {upcomingExhibitions.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-serif text-luxury-black mb-8">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {upcomingExhibitions.map((exhibition) => (
                <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
              ))}
            </div>
          </section>
        )}

        {/* Past Exhibitions */}
        {pastExhibitions.length > 0 && (
          <section>
            <h2 className="text-3xl font-serif text-luxury-black mb-8">Archive</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pastExhibitions.map((exhibition) => (
                <ExhibitionCard key={exhibition.id} exhibition={exhibition} compact />
              ))}
            </div>
          </section>
        )}

        {exhibitions.length === 0 && (
          <div className="text-center py-24 text-luxury-gray">
            <p>No exhibitions available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ExhibitionCard({ 
  exhibition, 
  compact = false 
}: { 
  exhibition: any
  compact?: boolean 
}) {
  const statusColors = {
    LIVE: 'bg-green-500',
    UPCOMING: 'bg-yellow-500',
    ENDED: 'bg-gray-400',
  }

  return (
    <Link href={`/exhibitions/${exhibition.slug}`} className="group">
      <div className={`relative ${compact ? 'aspect-[4/3]' : 'aspect-[16/9]'} overflow-hidden bg-luxury-cream mb-4`}>
        {exhibition.featuredImageUrl ? (
          <Image
            src={exhibition.featuredImageUrl}
            alt={exhibition.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-luxury-gold/20 to-luxury-cream">
            <span className="text-4xl font-serif text-luxury-black/20">Exhibition</span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`${statusColors[exhibition.status]} text-white text-xs uppercase tracking-wider px-3 py-1`}>
            {exhibition.status}
          </span>
        </div>
      </div>
      
      <h3 className={`${compact ? 'text-xl' : 'text-2xl'} font-serif text-luxury-black mb-2 group-hover:text-luxury-gold transition-colors`}>
        {exhibition.title}
      </h3>
      
      {!compact && (
        <p className="text-sm text-luxury-gray mb-4 line-clamp-2 leading-relaxed">
          {exhibition.description}
        </p>
      )}
      
      <div className="flex items-center gap-2 text-xs text-luxury-gray uppercase tracking-widest">
        <span>{format(new Date(exhibition.startDate), 'MMM d')}</span>
        <span>—</span>
        <span>{format(new Date(exhibition.endDate), 'MMM d, yyyy')}</span>
      </div>
    </Link>
  )
}
