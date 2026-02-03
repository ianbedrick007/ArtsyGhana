'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-helpers'
import { artistApplicationSchema, updateArtistStatusSchema } from '@/lib/validations'

export async function submitArtistApplication(data: unknown) {
  try {
    const validated = artistApplicationSchema.parse(data)

    const application = await prisma.artist.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        bio: validated.bio,
        instagramHandle: validated.instagramHandle,
        website: validated.website,
        portfolioUrl: validated.portfolioUrl,
        statement: validated.statement,
        status: 'PENDING',
      },
    })

    // TODO: Send email notification to admin
    console.log('[v0] Artist application submitted:', application.id)

    return { success: true, data: application }
  } catch (error) {
    console.error('[v0] Error submitting artist application:', error)
    return { success: false, error: 'Failed to submit application' }
  }
}

export async function updateArtistStatus(data: unknown) {
  try {
    await requireAdmin()
    const validated = updateArtistStatusSchema.parse(data)

    const artist = await prisma.artist.update({
      where: { id: validated.artistId },
      data: { status: validated.status },
    })

    // TODO: Send email notification to artist
    console.log('[v0] Artist status updated:', artist.id, validated.status)

    revalidatePath('/admin/artists')
    return { success: true, data: artist }
  } catch (error) {
    console.error('[v0] Error updating artist status:', error)
    return { success: false, error: 'Failed to update artist status' }
  }
}

export async function getArtists(status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
  try {
    const artists = await prisma.artist.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        artworks: {
          select: { id: true },
        },
      },
    })

    return { success: true, data: artists }
  } catch (error) {
    console.error('[v0] Error fetching artists:', error)
    return { success: false, error: 'Failed to fetch artists' }
  }
}

export async function getArtistBySlug(slug: string) {
  try {
    const artist = await prisma.artist.findUnique({
      where: { slug, status: 'APPROVED' },
      include: {
        artworks: {
          where: { isAvailable: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!artist) {
      return { success: false, error: 'Artist not found' }
    }

    return { success: true, data: artist }
  } catch (error) {
    console.error('[v0] Error fetching artist:', error)
    return { success: false, error: 'Failed to fetch artist' }
  }
}

export async function updateArtist(id: string, data: unknown) {
  try {
    await requireAdmin()

    const artist = await prisma.artist.update({
      where: { id },
      data: data as any, // Type properly based on validation schema
    })

    revalidatePath('/admin/artists')
    revalidatePath(`/artists/${artist.slug}`)
    return { success: true, data: artist }
  } catch (error) {
    console.error('[v0] Error updating artist:', error)
    return { success: false, error: 'Failed to update artist' }
  }
}

export async function deleteArtist(id: string) {
  try {
    await requireAdmin()

    await prisma.artist.delete({
      where: { id },
    })

    revalidatePath('/admin/artists')
    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting artist:', error)
    return { success: false, error: 'Failed to delete artist' }
  }
}
