import { PrismaClient, ArtistStatus, ArtworkType, ExhibitionStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('[v0] Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@artsyghana.com' },
    update: {},
    create: {
      email: 'admin@artsyghana.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })
  console.log('[v0] Created admin user:', admin.email)

  // Create artists
  const artists = [
    {
      name: 'Kwame Osei',
      slug: 'kwame-osei',
      email: 'kwame@example.com',
      bio: 'Contemporary Ghanaian artist specializing in abstract expressionism. My work explores the intersection of traditional African motifs and modern urban life.',
      image: '/images/artists/kwame.jpg',
      instagram: '@kwameosei_art',
      status: ArtistStatus.APPROVED,
      approvedAt: new Date(),
    },
    {
      name: 'Ama Mensah',
      slug: 'ama-mensah',
      email: 'ama@example.com',
      bio: 'Mixed media artist whose vibrant portraits celebrate African beauty and heritage. Each piece tells a story of resilience and joy.',
      image: '/images/artists/ama.jpg',
      instagram: '@ama_mensah',
      status: ArtistStatus.APPROVED,
      approvedAt: new Date(),
    },
    {
      name: 'Kofi Asante',
      slug: 'kofi-asante',
      email: 'kofi@example.com',
      bio: 'Street art meets gallery walls. I bring the energy of Accra streets into contemporary art spaces through bold colors and powerful messaging.',
      image: '/images/artists/kofi.jpg',
      instagram: '@kofi_asante',
      status: ArtistStatus.APPROVED,
      approvedAt: new Date(),
    },
    {
      name: 'Efua Boateng',
      slug: 'efua-boateng',
      email: 'efua@example.com',
      bio: 'Textile artist reimagining traditional Kente patterns in contemporary installations. My work bridges generations and techniques.',
      image: '/images/artists/efua.jpg',
      status: ArtistStatus.APPROVED,
      approvedAt: new Date(),
    },
  ]

  const createdArtists = []
  for (const artistData of artists) {
    const artist = await prisma.artist.upsert({
      where: { slug: artistData.slug },
      update: {},
      create: artistData,
    })
    createdArtists.push(artist)
    console.log('[v0] Created artist:', artist.name)
  }

  // Create artworks
  const artworks = [
    {
      title: 'Urban Echoes',
      slug: 'urban-echoes',
      description: 'A vibrant exploration of city life through layered textures and bold colors.',
      image: '/images/art-1.png',
      price: 850,
      type: ArtworkType.ORIGINAL,
      dimensions: '24" x 36"',
      medium: 'Acrylic on Canvas',
      year: 2024,
      available: true,
      featured: true,
      artistId: createdArtists[0].id,
    },
    {
      title: 'Ancestral Whispers',
      slug: 'ancestral-whispers',
      description: 'Traditional symbols reimagined in contemporary abstract forms.',
      image: '/images/art-2.png',
      price: 1200,
      type: ArtworkType.ORIGINAL,
      dimensions: '30" x 40"',
      medium: 'Mixed Media',
      year: 2024,
      available: true,
      featured: true,
      artistId: createdArtists[1].id,
    },
    {
      title: 'Coffee Queen',
      slug: 'coffee-queen',
      description: 'A celebration of African femininity and elegance.',
      image: '/images/coffee queen product.jpg',
      price: 750,
      type: ArtworkType.PRINT,
      dimensions: '18" x 24"',
      medium: 'Digital Print',
      year: 2024,
      available: true,
      featured: false,
      artistId: createdArtists[1].id,
    },
    {
      title: 'Black Beats',
      slug: 'black-beats',
      description: 'Rhythm and soul visualized through dynamic composition.',
      image: '/images/black beats product.jpg',
      price: 680,
      type: ArtworkType.PRINT,
      dimensions: '16" x 20"',
      medium: 'Digital Print',
      year: 2024,
      available: true,
      featured: false,
      artistId: createdArtists[2].id,
    },
    {
      title: 'Market Day',
      slug: 'market-day',
      description: 'The vibrant energy of Makola Market captured in color and movement.',
      image: '/images/MAKOLA.jpg',
      price: 950,
      type: ArtworkType.ORIGINAL,
      dimensions: '28" x 36"',
      medium: 'Oil on Canvas',
      year: 2024,
      available: true,
      featured: true,
      artistId: createdArtists[0].id,
    },
    {
      title: 'Golden Hour',
      slug: 'golden-hour',
      description: 'Sunset over Labadi Beach, where ocean meets sky.',
      image: '/images/photo_2025-01-23_14-56-46.jpg',
      price: 720,
      type: ArtworkType.PRINT,
      dimensions: '20" x 30"',
      medium: 'Photography Print',
      year: 2024,
      available: true,
      featured: false,
      artistId: createdArtists[2].id,
    },
    {
      title: 'Kente Dreams',
      slug: 'kente-dreams',
      description: 'Traditional patterns dancing in contemporary space.',
      image: '/images/photo_2025-01-23_14-56-47.jpg',
      price: 1100,
      type: ArtworkType.ORIGINAL,
      dimensions: '36" x 48"',
      medium: 'Textile & Mixed Media',
      year: 2024,
      available: true,
      featured: true,
      artistId: createdArtists[3].id,
    },
    {
      title: 'Resilience',
      slug: 'resilience',
      description: 'A powerful statement on strength and perseverance.',
      image: '/images/photo_2025-01-23_14-56-51.jpg',
      price: 890,
      type: ArtworkType.ORIGINAL,
      dimensions: '24" x 32"',
      medium: 'Acrylic & Spray Paint',
      year: 2024,
      available: true,
      featured: false,
      artistId: createdArtists[2].id,
    },
  ]

  const createdArtworks = []
  for (const artworkData of artworks) {
    const artwork = await prisma.artwork.upsert({
      where: { slug: artworkData.slug },
      update: {},
      create: artworkData,
    })
    createdArtworks.push(artwork)
    console.log('[v0] Created artwork:', artwork.title)
  }

  // Create exhibition
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 7) // Starts in 7 days

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 30) // Runs for 30 days

  const exhibition = await prisma.exhibition.upsert({
    where: { slug: 'new-visions-2024' },
    update: {},
    create: {
      title: 'New Visions 2024',
      slug: 'new-visions-2024',
      description: 'A groundbreaking exhibition showcasing the next generation of Ghanaian contemporary artists. Experience art in an immersive 3D gallery space.',
      image: '/images/exhibition-hero.jpg',
      startDate,
      endDate,
      status: ExhibitionStatus.UPCOMING,
      featured: true,
    },
  })
  console.log('[v0] Created exhibition:', exhibition.title)

  // Create exhibition rooms
  const mainRoom = await prisma.exhibitionRoom.create({
    data: {
      name: 'Main Gallery',
      description: 'The central exhibition space featuring our spotlight artists',
      order: 1,
      exhibitionId: exhibition.id,
    },
  })
  console.log('[v0] Created exhibition room:', mainRoom.name)

  // Add artworks to exhibition with 3D positions
  const exhibitionArtworks = [
    { artworkId: createdArtworks[0].id, hotspotPosition: { x: -2, y: 1.5, z: -5 }, order: 1 },
    { artworkId: createdArtworks[1].id, hotspotPosition: { x: 2, y: 1.5, z: -5 }, order: 2 },
    { artworkId: createdArtworks[4].id, hotspotPosition: { x: 0, y: 1.5, z: -7 }, order: 3 },
    { artworkId: createdArtworks[6].id, hotspotPosition: { x: -3, y: 1.5, z: -3 }, order: 4 },
  ]

  for (const eaData of exhibitionArtworks) {
    await prisma.exhibitionArtwork.create({
      data: {
        exhibitionId: exhibition.id,
        roomId: mainRoom.id,
        artworkId: eaData.artworkId,
        hotspotPosition: eaData.hotspotPosition,
        order: eaData.order,
      },
    })
  }
  console.log('[v0] Added artworks to exhibition')

  console.log('[v0] Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('[v0] Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
