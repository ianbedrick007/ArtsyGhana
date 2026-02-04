'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ExhibitionImageProps {
    src: string
    alt: string
    fallbackText?: string
}

export function ExhibitionImage({ src, alt, fallbackText = 'Exhibition' }: ExhibitionImageProps) {
    const [imageError, setImageError] = useState(false)

    if (imageError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burnished-gold/20 to-dark-white">
                <span className="text-4xl font-serif text-charcoal/20">{fallbackText}</span>
            </div>
        )
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
        />
    )
}
