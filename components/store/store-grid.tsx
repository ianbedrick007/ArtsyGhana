'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/store/useCart'
import { StoreFilters } from './store-filters'

type Artwork = {
  id: string
  title: string
  slug: string
  price: number
  imageUrl: string
  medium: string
  dimensions?: string | null
  category?: string | null
  artist: {
    id: string
    name: string
    slug: string
  }
}

type StoreGridProps = {
  artworks: Artwork[]
}

export function StoreGrid({ artworks }: StoreGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedArtist, setSelectedArtist] = useState<string>('all')
  const [maxPrice, setMaxPrice] = useState<number>(2000)
  const { addItem } = useCart()

  // Get unique categories and artists from artworks
  const categories = useMemo(() => {
    const cats = Array.from(new Set(artworks.map(a => a.category).filter(Boolean))) as string[]
    return ['All', ...cats]
  }, [artworks])

  const artists = useMemo(() => {
    const uniqueArtists = new Map()
    artworks.forEach(artwork => {
      if (!uniqueArtists.has(artwork.artist.id)) {
        uniqueArtists.set(artwork.artist.id, artwork.artist)
      }
    })
    return Array.from(uniqueArtists.values())
  }, [artworks])

  // Filter artworks
  const filteredArtworks = useMemo(() => {
    return artworks.filter(artwork => {
      if (selectedCategory !== 'All' && artwork.category !== selectedCategory) return false
      if (selectedArtist !== 'all' && artwork.artist.id !== selectedArtist) return false
      if (artwork.price > maxPrice) return false
      return true
    })
  }, [artworks, selectedCategory, selectedArtist, maxPrice])

  return (
    <div className="flex gap-12 w-full">
      {/* Sidebar Filters */}
      <aside className="hidden lg:block flex-shrink-0">
        <StoreFilters
          categories={categories}
          artists={artists}
          selectedCategory={selectedCategory}
          selectedArtist={selectedArtist}
          maxPrice={maxPrice}
          onCategoryChange={setSelectedCategory}
          onArtistChange={setSelectedArtist}
          onPriceChange={setMaxPrice}
        />
      </aside>

      {/* Main Grid */}
      <div className="flex-1">
        <div className="mb-8 text-sm text-warm-gray">
          Showing {filteredArtworks.length} piece{filteredArtworks.length !== 1 ? 's' : ''}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArtworks.map((artwork) => (
          <div key={artwork.id} className="group flex flex-col">
            <Link
              href={`/store/${artwork.slug}`}
              className="relative aspect-[4/5] overflow-hidden bg-dark-white mb-4 cursor-pointer"
            >
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>

            <div className="space-y-2">
              <Link href={`/store/${artwork.slug}`}>
                <h3 className="text-lg font-serif text-charcoal mb-1 group-hover:text-burnished-gold transition-colors">
                  {artwork.title}
                </h3>
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/artists/${artwork.artist.slug}`}>
                    <p className="text-xs text-warm-gray uppercase tracking-widest mb-1 hover:text-burnished-gold transition-colors">
                      By {artwork.artist.name}
                    </p>
                  </Link>
                  {artwork.category && (
                    <p className="text-xs text-warm-gray mb-1">{artwork.category}</p>
                  )}
                  {artwork.dimensions && (
                    <p className="text-xs text-warm-gray">{artwork.dimensions}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-charcoal mb-2">
                    ${artwork.price.toLocaleString()}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      addItem({
                        id: artwork.id,
                        name: artwork.title,
                        price: artwork.price,
                        quantity: 1,
                        image: artwork.imageUrl
                      })
                    }}
                    className="bg-charcoal text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-burnished-gold transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

        {filteredArtworks.length === 0 && (
          <div className="text-center py-24 text-warm-gray">
            No artworks found matching your filters.
          </div>
        )}
      </div>
    </div>
  )
}
