'use client'

import Image from 'next/image'
import { useCart } from '@/store/useCart'
import Link from 'next/link'

type ArtCardProps = {
  artwork: {
    id: string
    title: string
    slug: string
    price: number
    imageUrl: string
    artist: {
      name: string
      slug: string
    }
  }
}

export function ArtCard({ artwork }: ArtCardProps) {
  const { addItem } = useCart()

  return (
    <div className="group">
      <Link href={`/store/${artwork.slug}`} className="relative aspect-[4/5] overflow-hidden mb-6 bg-dark-white block">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-500 flex items-center justify-center">
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
            className="bg-white text-charcoal px-8 py-3 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-burnished-gold hover:text-white"
          >
            Add to Selection
          </button>
        </div>
      </Link>
      <div className="flex justify-between items-start">
        <div>
          <Link href={`/store/${artwork.slug}`}>
            <h3 className="text-lg font-serif text-charcoal mb-1 hover:text-burnished-gold transition-colors">
              {artwork.title}
            </h3>
          </Link>
          <Link href={`/artists/${artwork.artist.slug}`}>
            <p className="text-xs text-warm-gray uppercase tracking-widest hover:text-burnished-gold transition-colors">
              {artwork.artist.name}
            </p>
          </Link>
        </div>
        <div className="text-sm font-medium text-charcoal">GHS {artwork.price.toLocaleString()}</div>
      </div>
    </div>
  )
}
