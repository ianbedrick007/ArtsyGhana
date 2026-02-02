'use client'

import { useState } from 'react'
import Image from 'next/image'
import { products, Product } from '@/data/products'
import { useCart } from '@/store/useCart'

export default function StorePage() {
    const [filter, setFilter] = useState<string>('All')
    const { addItem } = useCart()

    const categories = ['All', 'Painting', 'Sculpture', 'Photography', 'Mixed Media']

    const filteredProducts = filter === 'All'
        ? products
        : products.filter(p => p.category === filter)

    return (
        <div className="min-h-screen bg-white pt-32 pb-24 px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-20 animate-fade-in">
                    <p className="text-luxury-gold text-xs uppercase tracking-[0.3em] mb-4">The Collection</p>
                    <h1 className="text-5xl md:text-6xl font-serif text-luxury-black mb-8">Available Works</h1>
                    <div className="w-[1px] h-12 bg-luxury-gold mx-auto" />
                </div>

                {/* Filter */}
                <div className="flex flex-wrap justify-center gap-6 mb-16 text-sm">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`uppercase tracking-widest transition-colors duration-300 pb-1 border-b ${filter === cat
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
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="group flex flex-col">
                            <div className="relative aspect-[4/5] overflow-hidden bg-luxury-cream mb-6 cursor-pointer">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />

                                {/* Overlay with Add to Cart */}
                                <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/10 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => addItem({
                                            id: product.id,
                                            name: product.name,
                                            price: product.price,
                                            quantity: 1,
                                            image: product.image
                                        })}
                                        className="bg-white text-luxury-black px-8 py-4 text-[10px] uppercase tracking-[0.2em] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-luxury-gold hover:text-white shadow-xl"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-baseline px-2">
                                <div>
                                    <h3 className="text-xl font-serif text-luxury-black mb-1 group-hover:text-luxury-gold transition-colors">{product.name}</h3>
                                    <p className="text-xs text-luxury-gray uppercase tracking-widest mb-1">{product.artist}</p>
                                    <p className="text-[10px] text-gray-400 italic">{product.dimensions}</p>
                                </div>
                                <div className="text-sm font-medium text-luxury-black">
                                    GHS {product.price.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-24 text-luxury-gray">
                        No artworks found in this category.
                    </div>
                )}

            </div>
        </div>
    )
}
