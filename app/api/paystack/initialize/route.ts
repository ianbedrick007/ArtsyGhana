import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { initializeTransaction, generatePaymentReference } from '@/lib/paystack'

const initializeSchema = z.object({
    orderId: z.string(),
    amount: z.number().positive(),
    email: z.string().email(),
    callbackUrl: z.string().url().optional(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const validation = initializeSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            )
        }

        const { orderId, amount, email, callbackUrl } = validation.data

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        })

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            )
        }

        // Check if payment already exists for this order
        const existingPayment = await prisma.payment.findUnique({
            where: { orderId },
        })

        if (existingPayment && existingPayment.status === 'SUCCESS') {
            return NextResponse.json(
                { error: 'Payment already completed for this order' },
                { status: 400 }
            )
        }

        // Generate payment reference
        const reference = generatePaymentReference('ARTSY')

        // Initialize Paystack transaction
        const result = await initializeTransaction({
            email,
            amount: Math.round(amount * 100), // Convert to kobo
            reference,
            metadata: {
                orderId,
                orderNumber: order.orderNumber,
            },
            callback_url: callbackUrl || `${process.env.NEXTAUTH_URL}/order/success`,
        })

        if (!result.status || !result.data) {
            return NextResponse.json(
                { error: result.message || 'Failed to initialize payment' },
                { status: 500 }
            )
        }

        // Update Order with reference
        await prisma.order.update({
            where: { id: orderId },
            data: { paystackRef: reference },
        })

        // Create or update payment record
        if (existingPayment) {
            await prisma.payment.update({
                where: { id: existingPayment.id },
                data: {
                    paystackRef: reference,
                    paystackAccessCode: result.data.access_code,
                    status: 'PENDING',
                    metadata: {
                        orderId,
                        orderNumber: order.orderNumber,
                    },
                },
            })
        } else {
            await prisma.payment.create({
                data: {
                    amount,
                    currency: 'GHS',
                    status: 'PENDING',
                    paystackRef: reference,
                    paystackAccessCode: result.data.access_code,
                    orderId,
                    metadata: {
                        orderId,
                        orderNumber: order.orderNumber,
                    },
                },
            })
        }

        return NextResponse.json({
            success: true,
            data: {
                authorization_url: result.data.authorization_url,
                access_code: result.data.access_code,
                reference: result.data.reference,
            },
        })
    } catch (error) {
        console.error('Payment initialization error:', error)
        return NextResponse.json(
            { error: 'An error occurred during payment initialization' },
            { status: 500 }
        )
    }
}
