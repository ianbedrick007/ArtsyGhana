import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE /api/admin/artworks/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params

        // Delete the artwork
        await prisma.artwork.delete({
            where: { id },
        })

        return NextResponse.json({ success: true, message: 'Product deleted successfully' })
    } catch (error) {
        console.error('Delete artwork error:', error)
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        )
    }
}

// PATCH /api/admin/artworks/[id]
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params
        const body = await request.json()

        // Update the artwork
        const artwork = await prisma.artwork.update({
            where: { id },
            data: {
                title: body.title,
                description: body.description,
                price: parseFloat(body.price),
                isAvailable: body.isAvailable,
                imageUrl: body.imageUrl,
                type: body.type,
            },
        })

        return NextResponse.json({ success: true, data: artwork })
    } catch (error) {
        console.error('Update artwork error:', error)
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        )
    }
}
