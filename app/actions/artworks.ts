'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-helpers'
import { artworkSchema } from '@/lib/validations'

export async function createArtwork(data: unknown) {
  try {
    await requireAdmin()
    const validated = artworkSchema.parse(data)

    const artwork = await prisma.artwork.create({
      data: {
        title: validated.title,
        description: validated.description,
        price: validated.price,
        artistId: validated.artistId,
        medium: validated.medium,
        dimensions: validated.dimensions,
        year: validated.year,
        imageUrl: validated.imageUrl,
        type: validated.type,
        category: validated.category,
        isAvailable: validated.isAvailable,
        isFeatured: validated.isFeatured,
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
    const artworks = await prisma.artwork.findMany({
      where: {
        ...filters,
        isAvailable: filters?.isAvailable !== false,
      },
      include: {
        artist: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
    })

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
        isFeatured: true,
        isAvailable: true,
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

    return { success: true, data: artworks }
  } catch (error) {
    console.error('[v0] Error fetching featured artworks:', error)
    return { success: false, error: 'Failed to fetch featured artworks' }
  }
}
