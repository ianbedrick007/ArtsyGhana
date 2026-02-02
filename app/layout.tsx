import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import Image from 'next/image'
import './globals.css'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const metadata: Metadata = {
    title: 'ArtsyGhana | Virtual Art Experience',
    description: 'High-performance, minimalist art gallery showcasing contemporary Ghanaian art.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={cn(inter.variable, outfit.variable, "font-sans min-h-screen bg-luxury-cream")}>
                <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-2 glass">
                    <a href="/" className="relative h-16 w-48 transition-opacity hover:opacity-80">
                        <Image
                            src="/images/ARTSYblack.png"
                            alt="ArtsyGhana Logo"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </a>
                    <div className="flex gap-8 text-sm uppercase tracking-widest font-medium text-luxury-black">
                        <a href="/" className="hover:text-luxury-gold transition-colors">Gallery</a>
                        <a href="/store" className="hover:text-luxury-gold transition-colors">Shop</a>
                        <a href="/blog" className="hover:text-luxury-gold transition-colors">Stories</a>
                        <a href="/cart" className="hover:text-luxury-gold transition-colors">Cart</a>
                    </div>
                </nav>
                <main>{children}</main>
            </body>
        </html>
    )
}
