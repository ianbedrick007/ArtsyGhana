import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SessionProvider } from '@/components/providers/session-provider'
import { Navigation } from '@/components/navigation'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const metadata: Metadata = {
    title: 'ArtsyGhana | Virtual Art Experience',
    description: 'High-performance, minimalist art gallery showcasing contemporary Ghanaian art.',
    generator: 'v0.app'
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={cn(inter.variable, playfair.variable, "font-sans min-h-screen bg-dark-white")}>
                <SessionProvider>
                    <Navigation />
                    <main>{children}</main>
                </SessionProvider>
            </body>
        </html>
    )
}
