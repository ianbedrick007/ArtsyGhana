'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-helpers'
import { artworkSchema } from '@/lib/validations'
// import { mockArtworks } from '@/lib/mock-data'

import { slugify } from '@/lib/utils'

export async function createArtwork(data: unknown) {
  try {
    await requireAdmin()
    const validated = artworkSchema.parse(data)

    const slug = `${slugify(validated.title)}-${Date.now()}`

    const artwork = await prisma.artwork.create({
      data: {
        title: validated.title,
        slug,
        description: validated.description,
        price: validated.price,
        artistId: validated.artistId,
        medium: validated.medium,
        dimensions: validated.dimensions,
        year: validated.year,
        image: validated.imageUrl,
        type: validated.type,
        available: validated.isAvailable,
        featured: validated.isFeatured,
      },
    })

    console.log('[v0] Artwork created:', artwork.id)
    revalidatePath('/admin/artworks')
    revalidatePath('/store')
    return { success: true, data: artwork }
  } catch (error) {
    console.error('[v0] Error creating artwork:', error)
    return { success: false, error: 'Failed to create artwork' }
  }
}

export async function updateArtwork(id: string, data: unknown) {
  try {
    await requireAdmin()
    const validated = artworkSchema.partial().parse(data)

    const artwork = await prisma.artwork.update({
      where: { id },
      data: validated,
    })

    console.log('[v0] Artwork updated:', artwork.id)
    revalidatePath('/admin/artworks')
    revalidatePath('/store')
    revalidatePath(`/store/${artwork.slug}`)
    return { success: true, data: artwork }
  } catch (error) {
    console.error('[v0] Error updating artwork:', error)
    return { success: false, error: 'Failed to update artwork' }
  }
}

export async function deleteArtwork(id: string) {
  try {
    await requireAdmin()

    await prisma.artwork.delete({
      where: { id },
    })

    console.log('[v0] Artwork deleted:', id)
    revalidatePath('/admin/artworks')
    revalidatePath('/store')
    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting artwork:', error)
    return { success: false, error: 'Failed to delete artwork' }
  }
}

export async function getArtworks(filters?: {
  category?: string
  artistId?: string
  isFeatured?: boolean
  isAvailable?: boolean
}) {
  try {
    const where: any = {}
    if (filters?.artistId) where.artistId = filters.artistId
    if (filters?.isFeatured !== undefined) where.featured = filters.isFeatured
    if (filters?.isAvailable === false) {
      // No filter needed as we want all
    } else if (filters?.isAvailable === true) {
      where.available = true
    }

    const artworks = await prisma.artwork.findMany({
      where,
      include: {
        artist: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    console.log('[v0] Fetched artworks:', artworks.length)
    return { success: true, data: artworks }
  } catch (error) {
    console.error('[v0] Error fetching artworks:', error)
    return { success: false, error: 'Failed to fetch artworks' }
  }
}

export async function getArtworkBySlug(slug: string) {
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { slug },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            slug: true,
            bio: true,
          },
        },
      },
    })

    if (!artwork) {
      return { success: false, error: 'Artwork not found' }
    }

    return { success: true, data: artwork }
  } catch (error) {
    console.error('[v0] Error fetching artwork:', error)
    return { success: false, error: 'Failed to fetch artwork' }
  }
}

export async function getFeaturedArtworks(limit = 6) {
  try {
    const artworks = await prisma.artwork.findMany({
      where: {
        featured: true,
        available: true,
      },
      include: {
        artist: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    console.log('[v0] Fetched featured artworks:', artworks.length)
    return { success: true, data: artworks }
  } catch (error) {
    console.error('[v0] Error fetching featured artworks:', error)
    return { success: false, error: 'Failed to fetch featured artworks' }
  }
}
