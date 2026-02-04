'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ArtworkImageProps {
  src: string
  alt: string
  title: string
}

export function ArtworkImage({ src, alt, title }: ArtworkImageProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burnished-gold/20 to-dark-white">
        <span className="text-4xl font-serif text-charcoal/20">{title.charAt(0)}</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-105"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onError={() => setImageError(true)}
    />
  )
}
