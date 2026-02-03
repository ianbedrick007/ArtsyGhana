import { products, type Product } from '@/data/products'

// Convert products to artwork format
export function convertProductToArtwork(product: Product) {
  return {
    id: product.id,
    title: product.name,
    slug: product.name.toLowerCase().replace(/\s+/g, '-'),
    description: product.description,
    price: product.price,
    imageUrl: product.image,
    medium: product.category,
    dimensions: product.dimensions || '',
    year: 2024,
    type: 'ORIGINAL' as const,
    category: product.category,
    isAvailable: true,
    isFeatured: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].includes(product.id),
    artist: {
      id: `artist-${product.artist}`,
      name: product.artist,
      slug: product.artist.toLowerCase().replace(/\s+/g, '-'),
      bio: `Contemporary Ghanaian artist ${product.artist}`,
    },
    artistId: `artist-${product.artist}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export const mockArtworks = products.map(convertProductToArtwork)

export const mockArtists = Array.from(
  new Set(products.map((p) => p.artist))
).map((artistName, index) => ({
  id: `artist-${artistName}`,
  name: artistName,
  slug: artistName.toLowerCase().replace(/\s+/g, '-'),
  bio: `${artistName} is a contemporary Ghanaian artist known for their unique perspective and masterful technique.`,
  email: `${artistName.toLowerCase().replace(/\s+/g, '')}@artsyghana.com`,
  phone: '',
  website: '',
  instagram: '',
  imageUrl: '',
  status: 'APPROVED' as const,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  artworks: mockArtworks.filter((a) => a.artist.name === artistName),
}))

export const mockExhibition = {
  id: 'exhibition-1',
  title: 'Echoes of Heritage',
  slug: 'echoes-of-heritage',
  description:
    'A curated exhibition celebrating the richness of Ghanaian contemporary art and cultural heritage.',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  imageUrl: '/images/art-1.png',
  status: 'ACTIVE' as const,
  isCurrent: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  rooms: [],
}
