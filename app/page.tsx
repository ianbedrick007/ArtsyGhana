'use client'

import Gallery3D from '@/components/Gallery3D'
import { Suspense, useState } from 'react'
import { products } from '@/data/products'
import { useCart } from '@/store/useCart'
import Image from 'next/image'

export default function Home() {
    const [showExhibition, setShowExhibition] = useState(false)

    // Pick specific items to feature
    const featuredIds = ['p1', 'p2', 'p3']
    const featuredProducts = products.filter(p => featuredIds.includes(p.id))

    if (showExhibition) {
        return (
            <div className="relative h-screen w-full bg-luxury-cream">
                <button
                    onClick={() => setShowExhibition(false)}
                    className="absolute top-8 left-8 z-[100] border border-luxury-black px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-luxury-black hover:text-white transition-all duration-500 glass"
                >
                    ← Exit Exhibition
                </button>
                <Suspense fallback={
                    <div className="h-screen w-full flex items-center justify-center bg-luxury-cream">
                        <div className="text-luxury-gold animate-pulse text-sm uppercase tracking-widest">
                            Initializing virtual gallery...
                        </div>
                    </div>
                }>
                    <Gallery3D />
                </Suspense>
            </div>
        )
    }

    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-luxury-cream">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-luxury-gold rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-luxury-gold rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 text-center max-w-5xl px-8">
                    <p className="text-luxury-gold text-xs uppercase tracking-[0.4em] mb-6 font-semibold animate-fade-in">
                        EST. 2024 • ACCRA, GHANA
                    </p>
                    <h1 className="text-7xl md:text-9xl font-serif text-luxury-black mb-8 leading-tight tracking-tighter">
                        Where heritage <br />
                        <span className="italic">meets</span> innovation.
                    </h1>
                    <p className="text-luxury-gray text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                        A curated digital sanctuary for contemporary Ghanaian art.
                        Experience the soul of West African creativity through an immersive virtual lens.
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <button
                            onClick={() => setShowExhibition(true)}
                            className="group relative bg-luxury-black text-white px-12 py-5 text-xs uppercase tracking-[0.25em] overflow-hidden transition-all duration-500"
                        >
                            <span className="relative z-10">Enter Exhibition</span>
                            <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </button>
                        <a href="/store" className="text-xs uppercase tracking-[0.25em] border-b border-luxury-black pb-1 hover:text-luxury-gold hover:border-luxury-gold transition-all duration-300">
                            Browse Collections
                        </a>
                    </div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-widest text-luxury-gray mb-4">Discover More</span>
                    <div className="w-[1px] h-16 bg-gradient-to-down from-luxury-gold to-transparent" />
                </div>
            </section>

            {/* Featured Artwork Section */}
            <section id="collections" className="bg-white py-32 px-8">
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
                        {featuredProducts.map(product => (
                            <ArtCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="bg-luxury-cream py-32 px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-serif mb-12 italic text-luxury-black">"Art is the only way to run away without leaving home."</h2>
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
                    <p className="text-gray-400 mb-12 text-sm uppercase tracking-widest">Receive private invites to new exhibition launches.</p>
                    <div className="flex border-b border-gray-700 pb-2">
                        <input type="email" placeholder="Your Email Address" className="bg-transparent flex-grow px-4 py-2 focus:outline-none text-sm font-light tracking-wide" />
                        <button className="text-xs uppercase tracking-widest text-luxury-gold hover:text-white transition-colors">Subscribe</button>
                    </div>
                </div>
            </section>

            <footer className="bg-luxury-black py-12 px-8 border-t border-gray-800 text-gray-500 text-[10px] uppercase tracking-[0.3em] flex justify-between items-center">
                <div>© 2024 ArtsyGhana. Accra.</div>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-white transition-colors">Instagram</a>
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">Artsy</a>
                </div>
            </footer>
        </div>
    )
}

function ArtCard({ product }: any) {
    const { addItem } = useCart()

    return (
        <div className="group">
            <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-luxury-cream">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/20 transition-colors duration-500 flex items-center justify-center">
                    <button
                        onClick={() => addItem({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            quantity: 1,
                            image: product.image
                        })}
                        className="bg-white text-luxury-black px-8 py-3 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-luxury-gold hover:text-white"
                    >
                        Add to Selection
                    </button>
                </div>
            </div>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-serif text-luxury-black mb-1">{product.name}</h3>
                    <p className="text-xs text-luxury-gray uppercase tracking-widest">{product.artist}</p>
                </div>
                <div className="text-sm font-medium text-luxury-black">GHS {product.price.toLocaleString()}</div>
            </div>
        </div>
    )
}
