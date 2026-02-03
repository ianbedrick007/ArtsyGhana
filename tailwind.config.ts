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
                'luxury-cream': '#F9F7F2',
                'luxury-gold': '#C5A059',
                'luxury-black': '#1A1A1A',
                'luxury-gray': '#707070',
            },
            fontFamily: {
                serif: ['var(--font-outfit)', 'serif'],
                sans: ['var(--font-inter)', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
export default config
