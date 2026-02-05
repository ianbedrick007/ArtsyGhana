import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/api-middleware'
import { createArtworkSchema } from '@/lib/validation'
import { prisma } from '@/lib/prisma'
import { sanitizeString } from '@/lib/validation'
import { apiLimiter, getClientIp, applyRateLimit } from '@/lib/rate-limit'

// POST /api/admin/artworks - Create new artwork
export async function POST(request: NextRequest) {
    try {
        // Apply rate limiting
        const clientIp = getClientIp(request)
        const rateLimitResponse = await applyRateLimit(apiLimiter, 30, clientIp)
        if (rateLimitResponse) {
            return rateLimitResponse
        }

        // Authenticate and validate
        const authResult = await withAuth(request, createArtworkSchema)
        if ('error' in authResult) {
            return authResult.error
        }

        const data = authResult.data!

        // Sanitize string inputs
        const sanitizedData = {
            title: sanitizeString(data.title),
            description: sanitizeString(data.description),
            artistName: sanitizeString(data.artistName),
            dimensions: sanitizeString(data.dimensions),
            medium: data.medium,
            imageUrl: data.imageUrl,
            price: data.price,
            year: data.year,
            isAvailable: data.isAvailable,
            isFeatured: data.isFeatured,
        }

        // Generate unique slug from title
        const baseSlug = sanitizedData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        const slug = `${baseSlug}-${Date.now()}`

        // Validate imageUrl is accessible (basic check)
        if (!sanitizedData.imageUrl.startsWith('https://')) {
            return NextResponse.json(
                { error: 'Image URL must use HTTPS' },
                { status: 400 }
            )
        }

        // Create artwork with Prisma (SQL injection protection included)
        const artwork = await prisma.artwork.create({
            data: {
                title: sanitizedData.title,
                slug,
                description: sanitizedData.description,
                price: sanitizedData.price,
                image: sanitizedData.imageUrl,
                medium: sanitizedData.medium,
                dimensions: sanitizedData.dimensions,
                year: sanitizedData.year,
                available: sanitizedData.isAvailable ?? true,
                featured: sanitizedData.isFeatured ?? false,
                artist: {
                    // For now, create a simple artist relationship
                    // In production, you'd want to link to existing artists
                    connectOrCreate: {
                        where: { email: `${sanitizedData.artistName.toLowerCase().replace(/\s+/g, '.')}@artsyghana.com` },
                        create: {
                            name: sanitizedData.artistName,
                            slug: `${sanitizedData.artistName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
                            email: `${sanitizedData.artistName.toLowerCase().replace(/\s+/g, '.')}@artsyghana.com`,
                            bio: `Artist: ${sanitizedData.artistName}`,
                            status: 'APPROVED',
                        },
                    },
                },
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
        })

        return NextResponse.json(
            { success: true, data: artwork },
            { status: 201 }
        )
    } catch (error: any) {
        console.error('Create artwork error:', error)

        // Handle Prisma unique constraint violations
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'An artwork with this slug already exists' },
                { status: 409 }
            )
        }

        const isDev = process.env.NODE_ENV === 'development'
        return NextResponse.json(
            { error: isDev ? error.message : 'Failed to create artwork' },
            { status: 500 }
        )
    }
}

// GET /api/admin/artworks - List all artworks (admin view)
export async function GET(request: NextRequest) {
    try {
        // Authenticate
        const authResult = await withAuth(request)
        if ('error' in authResult) {
            return authResult.error
        }

        const artworks = await prisma.artwork.findMany({
            include: {
                artist: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json({ success: true, data: artworks })
    } catch (error) {
        console.error('List artworks error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch artworks' },
            { status: 500 }
        )
    }
}
