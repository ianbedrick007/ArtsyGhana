import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    future: {
        hoverOnlyWhenSupported: true,
    },
    theme: {
        extend: {
            colors: {
                'charcoal': '#2D2D2D',
                'dark-white': '#F8F8F8',
                'warm-gray': '#BDBDBD',
                'light-grey': '#E0E0E0',
                'burnished-gold': '#B58D41',
                'bronze': '#8D6B3B',
                // Keep old names for backward compatibility during migration
                'luxury-cream': '#F8F8F8',
                'luxury-gold': '#B58D41',
                'luxury-black': '#2D2D2D',
                'luxury-gray': '#BDBDBD',
            },
            fontFamily: {
                serif: ['var(--font-playfair)', 'serif'],
                sans: ['var(--font-inter)', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
export default config
