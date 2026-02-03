'use server'

import { revalidatePath } from 'next/cache'
// import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-helpers'
import { exhibitionSchema, exhibitionRoomSchema, hotspotSchema } from '@/lib/validations'
import { mockExhibition } from '@/lib/mock-data'

export async function createExhibition(data: unknown) {
  try {
    await requireAdmin()
    const validated = exhibitionSchema.parse(data)

    const exhibition = await prisma.exhibition.create({
      data: {
        title: validated.title,
        description: validated.description,
        curatorNotes: validated.curatorNotes,
        startDate: validated.startDate,
        endDate: validated.endDate,
        location: validated.location,
        featuredImageUrl: validated.featuredImageUrl,
        status: validated.status,
      },
    })

    console.log('[v0] Exhibition created:', exhibition.id)
    revalidatePath('/admin/exhibitions')
    revalidatePath('/exhibitions')
    return { success: true, data: exhibition }
  } catch (error) {
    console.error('[v0] Error creating exhibition:', error)
    return { success: false, error: 'Failed to create exhibition' }
  }
}

export async function updateExhibition(id: string, data: unknown) {
  try {
    await requireAdmin()
    const validated = exhibitionSchema.partial().parse(data)

    const exhibition = await prisma.exhibition.update({
      where: { id },
      data: validated,
    })

    console.log('[v0] Exhibition updated:', exhibition.id)
    revalidatePath('/admin/exhibitions')
    revalidatePath('/exhibitions')
    revalidatePath(`/exhibitions/${exhibition.slug}`)
    return { success: true, data: exhibition }
  } catch (error) {
    console.error('[v0] Error updating exhibition:', error)
    return { success: false, error: 'Failed to update exhibition' }
  }
}

export async function deleteExhibition(id: string) {
  try {
    await requireAdmin()

    await prisma.exhibition.delete({
      where: { id },
    })

    console.log('[v0] Exhibition deleted:', id)
    revalidatePath('/admin/exhibitions')
    revalidatePath('/exhibitions')
    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting exhibition:', error)
    return { success: false, error: 'Failed to delete exhibition' }
  }
}

export async function getExhibitions(status?: 'UPCOMING' | 'LIVE' | 'ENDED') {
  try {
    // TODO: Replace with actual Prisma query once database is set up
    let exhibitions = [mockExhibition]

    if (status) {
      exhibitions = exhibitions.filter((e) => e.status === status)
    }

    console.log('[v0] Fetched exhibitions:', exhibitions.length)
    return { success: true, data: exhibitions }
  } catch (error) {
    console.error('[v0] Error fetching exhibitions:', error)
    return { success: false, error: 'Failed to fetch exhibitions' }
  }
}

export async function getExhibitionBySlug(slug: string) {
  try {
    const exhibition = await prisma.exhibition.findUnique({
      where: { slug },
      include: {
        rooms: {
          include: {
            hotspots: {
              include: {
                artwork: {
                  include: {
                    artist: {
                      select: {
                        name: true,
                        slug: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!exhibition) {
      return { success: false, error: 'Exhibition not found' }
    }

    return { success: true, data: exhibition }
  } catch (error) {
    console.error('[v0] Error fetching exhibition:', error)
    return { success: false, error: 'Failed to fetch exhibition' }
  }
}

export async function createExhibitionRoom(data: unknown) {
  try {
    await requireAdmin()
    const validated = exhibitionRoomSchema.parse(data)

    const room = await prisma.exhibitionRoom.create({
      data: validated,
    })

    console.log('[v0] Exhibition room created:', room.id)
    revalidatePath('/admin/exhibitions')
    return { success: true, data: room }
  } catch (error) {
    console.error('[v0] Error creating exhibition room:', error)
    return { success: false, error: 'Failed to create room' }
  }
}

export async function addHotspotToRoom(data: unknown) {
  try {
    await requireAdmin()
    const validated = hotspotSchema.parse(data)

    const hotspot = await prisma.hotspot.create({
      data: validated,
    })

    console.log('[v0] Hotspot created:', hotspot.id)
    revalidatePath('/admin/exhibitions')
    return { success: true, data: hotspot }
  } catch (error) {
    console.error('[v0] Error creating hotspot:', error)
    return { success: false, error: 'Failed to create hotspot' }
  }
}

export async function deleteHotspot(id: string) {
  try {
    await requireAdmin()

    await prisma.hotspot.delete({
      where: { id },
    })

    console.log('[v0] Hotspot deleted:', id)
    revalidatePath('/admin/exhibitions')
    return { success: true }
  } catch (error) {
    console.error('[v0] Error deleting hotspot:', error)
    return { success: false, error: 'Failed to delete hotspot' }
  }
}

export async function getCurrentExhibition() {
  try {
    // TODO: Replace with actual Prisma query once database is set up
    const exhibition = mockExhibition

    console.log('[v0] Fetched current exhibition:', exhibition.title)
    return { success: true, data: exhibition }
  } catch (error) {
    console.error('[v0] Error fetching current exhibition:', error)
    return { success: false, error: 'Failed to fetch current exhibition' }
  }
}
