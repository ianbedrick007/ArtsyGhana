'use client'

import { useState } from 'react'

type Artist = {
  id: string
  name: string
  slug: string
}

type StoreFiltersProps = {
  categories: string[]
  artists: Artist[]
  selectedCategory: string
  selectedArtist: string
  maxPrice: number
  onCategoryChange: (category: string) => void
  onArtistChange: (artistId: string) => void
  onPriceChange: (price: number) => void
}

export function StoreFilters({
  categories,
  artists,
  selectedCategory,
  selectedArtist,
  maxPrice,
  onCategoryChange,
  onArtistChange,
  onPriceChange,
}: StoreFiltersProps) {
  return (
    <div className="w-64 space-y-8">
      {/* Category Filter */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-charcoal mb-4 font-medium">CATEGORY</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`block w-full text-left text-sm py-2 px-3 transition-colors ${
                selectedCategory === category
                  ? 'bg-charcoal text-white'
                  : 'text-warm-gray hover:text-charcoal'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Artist Filter */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-charcoal mb-4 font-medium">ARTIST</h3>
        <div className="space-y-2">
          <button
            onClick={() => onArtistChange('all')}
            className={`block w-full text-left text-sm py-2 px-3 transition-colors ${
              selectedArtist === 'all'
                ? 'bg-burnished-gold text-white'
                : 'text-warm-gray hover:text-charcoal'
            }`}
          >
            All Artists
          </button>
          {artists.map((artist) => (
            <button
              key={artist.id}
              onClick={() => onArtistChange(artist.id)}
              className={`block w-full text-left text-sm py-2 px-3 transition-colors ${
                selectedArtist === artist.id
                  ? 'bg-burnished-gold text-white'
                  : 'text-warm-gray hover:text-charcoal'
              }`}
            >
              {artist.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-charcoal mb-4 font-medium">PRICE RANGE</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="2000"
            value={maxPrice}
            onChange={(e) => onPriceChange(Number(e.target.value))}
            className="w-full h-2 bg-light-grey rounded-lg appearance-none cursor-pointer accent-burnished-gold"
          />
          <div className="text-sm text-warm-gray">
            Up to ${maxPrice.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}
