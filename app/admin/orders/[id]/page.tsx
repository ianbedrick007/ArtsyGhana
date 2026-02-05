import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { OrderDetailsClient } from '@/components/admin/order-details-client'

export const dynamic = 'force-dynamic'

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
            items: {
                include: {
                    artwork: true,
                },
            },
            payment: true,
        },
    })

    if (!order) {
        notFound()
    }

    return <OrderDetailsClient order={order} />
}
