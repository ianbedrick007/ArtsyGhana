export interface Product {
    id: string
    name: string
    artist: string
    price: number
    category: 'Painting' | 'Sculpture' | 'Photography' | 'Mixed Media'
    image: string
    description: string
    dimensions?: string
}

export const products: Product[] = [
    {
        id: 'p1',
        name: 'Makola Market Rhythms',
        artist: 'Kwame A.',
        price: 4500,
        category: 'Painting',
        image: '/images/MAKOLA.jpg',
        description: 'A vibrant capture of the bustling energy at Accra’s famous Makola Market. Oil on canvas.',
        dimensions: '48" x 60"'
    },
    {
        id: 'p2',
        name: 'Spirit of Accra',
        artist: 'Amara K.',
        price: 5200,
        category: 'Painting',
        image: '/images/art-1.png',
        description: 'Abstract interpretation of the city’s soul, featuring gold leaf accents and earth tones.',
        dimensions: '36" x 36"'
    },
    {
        id: 'p3',
        name: 'Fluid Harmony',
        artist: 'Kofi B.',
        price: 3800,
        category: 'Sculpture',
        image: '/images/art-2.png',
        description: 'Bronze and reclaimed wood sculpture representing the fluidity of modern Ghanaian identity.',
        dimensions: '18" x 12" x 12"'
    },
    {
        id: 'p4',
        name: 'Black Beats',
        artist: 'Jojo Marfo',
        price: 2900,
        category: 'Mixed Media',
        image: '/images/black beats product.jpg',
        description: 'Contemporary mixed media piece exploring the intersection of music and visual art.',
        dimensions: '24" x 36"'
    },
    {
        id: 'p5',
        name: 'Coffee Queen',
        artist: 'Abena O.',
        price: 3100,
        category: 'Painting',
        image: '/images/coffee queen product.jpg',
        description: 'A regal portrait celebrating the beauty and strength of the modern African woman.',
        dimensions: '30" x 40"'
    },
    {
        id: 'p6',
        name: 'Urban Echoes I',
        artist: 'Emmanuel S.',
        price: 1800,
        category: 'Photography',
        image: '/images/photo_2025-01-23_14-56-46.jpg',
        description: 'Part of the Urban Echoes series, documenting the changing architectural landscape of Jamestown.',
        dimensions: '20" x 30"'
    },
    {
        id: 'p7',
        name: 'Urban Echoes II',
        artist: 'Emmanuel S.',
        price: 1800,
        category: 'Photography',
        image: '/images/photo_2025-01-23_14-56-47.jpg',
        description: 'A study of shadows and light in the historic districts of Accra.',
        dimensions: '20" x 30"'
    },
    {
        id: 'p8',
        name: 'Urban Echoes III',
        artist: 'Emmanuel S.',
        price: 1800,
        category: 'Photography',
        image: '/images/photo_2025-01-23_14-56-51.jpg',
        description: 'Capturing the color and texture of street life in Ghana.',
        dimensions: '20" x 30"'
    },
    {
        id: 'p9',
        name: 'Ancestral Wall',
        artist: 'Yaw T.',
        price: 6500,
        category: 'Mixed Media',
        image: '/images/wall art.JPG',
        description: 'Large scale installation piece incorporating traditional Adinkra symbols.',
        dimensions: '72" x 48"'
    }
]
