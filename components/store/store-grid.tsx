'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/store/useCart'

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
  const [filter, setFilter] = useState<string>('All')
  const { addItem } = useCart()

  // Get unique categories from artworks
  const categories = ['All', ...Array.from(new Set(artworks.map(a => a.category).filter(Boolean)))]

  const filteredArtworks = filter === 'All'
    ? artworks
    : artworks.filter(a => a.category === filter)

  return (
    <>
      {/* Filter */}
      <div className="flex flex-wrap justify-center gap-6 mb-16 text-sm">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat || 'All')}
            className={`uppercase tracking-widest transition-colors duration-300 pb-1 border-b ${
              filter === cat
                ? 'text-luxury-black border-luxury-black'
                : 'text-luxury-gray border-transparent hover:text-luxury-gold'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {filteredArtworks.map((artwork) => (
          <div key={artwork.id} className="group flex flex-col">
            <Link
              href={`/store/${artwork.slug}`}
              className="relative aspect-[4/5] overflow-hidden bg-luxury-cream mb-6 cursor-pointer"
            >
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Overlay with Add to Cart */}
              <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/10 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
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
                  className="bg-white text-luxury-black px-8 py-4 text-[10px] uppercase tracking-[0.2em] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-luxury-gold hover:text-white shadow-xl"
                >
                  Add to Cart
                </button>
              </div>
            </Link>

            <div className="flex justify-between items-baseline px-2">
              <div>
                <Link href={`/store/${artwork.slug}`}>
                  <h3 className="text-xl font-serif text-luxury-black mb-1 group-hover:text-luxury-gold transition-colors">
                    {artwork.title}
                  </h3>
                </Link>
                <Link href={`/artists/${artwork.artist.slug}`}>
                  <p className="text-xs text-luxury-gray uppercase tracking-widest mb-1 hover:text-luxury-gold transition-colors">
                    {artwork.artist.name}
                  </p>
                </Link>
                {artwork.dimensions && (
                  <p className="text-[10px] text-gray-400 italic">{artwork.dimensions}</p>
                )}
              </div>
              <div className="text-sm font-medium text-luxury-black">
                GHS {artwork.price.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArtworks.length === 0 && (
        <div className="text-center py-24 text-luxury-gray">
          No artworks found in this category.
        </div>
      )}
    </>
  )
}
