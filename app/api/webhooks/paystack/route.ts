import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { verifyPaystackSignature } from '@/lib/paystack'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Webhook event schema
const webhookEventSchema = z.object({
    event: z.string(),
    data: z.object({
        reference: z.string(),
        status: z.string(),
        amount: z.number(),
        currency: z.string(),
        customer: z.object({
            email: z.string().email(),
        }),
        metadata: z.any().optional(),
    }),
})

// Idempotency cache to prevent duplicate webhook processing
const processedWebhooks = new Set<string>()

export async function POST(request: NextRequest) {
    try {
        // Get raw body for signature verification
        const rawBody = await request.text()

        // Get Paystack signature from headers
        const headersList = headers()
        const signature = headersList.get('x-paystack-signature')

        if (!signature) {
            console.warn('Webhook received without signature')
            return NextResponse.json(
                { error: 'No signature provided' },
                { status: 400 }
            )
        }

        // Verify webhook signature - CRITICAL SECURITY CHECK
        if (!verifyPaystackSignature(rawBody, signature)) {
            console.error('Invalid webhook signature')
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            )
        }

        // Parse and validate webhook data
        const body = JSON.parse(rawBody)
        const validation = webhookEventSchema.safeParse(body)

        if (!validation.success) {
            console.error('Invalid webhook payload:', validation.error)
            return NextResponse.json(
                { error: 'Invalid payload' },
                { status: 400 }
            )
        }

        const { event, data } = validation.data

        // Idempotency check - prevent duplicate processing
        const idempotencyKey = `${data.reference}-${event}`
        if (processedWebhooks.has(idempotencyKey)) {
            console.log(`Duplicate webhook ignored: ${idempotencyKey}`)
            return NextResponse.json({ received: true })
        }

        // Process different event types
        switch (event) {
            case 'charge.success':
                await handleSuccessfulPayment(data)
                break

            case 'charge.failed':
                await handleFailedPayment(data)
                break

            default:
                console.log(`Unhandled event type: ${event}`)
        }

        // Mark as processed
        processedWebhooks.add(idempotencyKey)

        // Clean up old entries (keep last 1000)
        if (processedWebhooks.size > 1000) {
            const entries = Array.from(processedWebhooks)
            entries.slice(0, entries.length - 1000).forEach(key => processedWebhooks.delete(key))
        }

        // Return 200 immediately (Paystack expects quick response)
        return NextResponse.json({ received: true })

    } catch (error) {
        console.error('Webhook processing error:', error)
        // Still return 200 to prevent Paystack from retrying
        return NextResponse.json({ received: true })
    }
}

async function handleSuccessfulPayment(data: any) {
    try {
        const { reference, amount, status, customer } = data

        // Find order by Paystack reference
        const order = await prisma.order.findUnique({
            where: { paystackRef: reference },
            include: { items: true },
        })

        if (!order) {
            console.error(`Order not found for reference: ${reference}`)
            return
        }

        // Verify amount matches (convert from kobo/pesewas)
        const paidAmount = amount / 100
        const expectedAmount = order.total

        if (Math.abs(paidAmount - expectedAmount) > 0.01) {
            console.error(`Payment amount mismatch. Expected: ${expectedAmount}, Paid: ${paidAmount}`)
            // Mark as failed and notify admin
            await prisma.order.update({
                where: { id: order.id },
                data: { status: 'CANCELLED' },
            })
            return
        }

        // Update order status
        await prisma.order.update({
            where: { id: order.id },
            data: {
                status: 'PROCESSING',
            },
        })

        // Create payment record
        await prisma.payment.create({
            data: {
                amount: paidAmount,
                currency: data.currency || 'GHS',
                status: 'SUCCESS',
                method: 'paystack',
                paystackRef: reference,
                metadata: data.metadata,
                orderId: order.id,
            },
        })

        console.log(`Payment successful for order ${order.id}`)

        // TODO: Send confirmation email to customer
        // TODO: Notify admin of new order

    } catch (error) {
        console.error('Error handling successful payment:', error)
    }
}

async function handleFailedPayment(data: any) {
    try {
        const { reference } = data

        const order = await prisma.order.findUnique({
            where: { paystackRef: reference },
        })

        if (!order) {
            console.error(`Order not found for failed payment: ${reference}`)
            return
        }

        // Update order status
        await prisma.order.update({
            where: { id: order.id },
            data: { status: 'CANCELLED' },
        })

        // Create failed payment record
        await prisma.payment.create({
            data: {
                amount: data.amount / 100,
                currency: data.currency || 'GHS',
                status: 'FAILED',
                method: 'paystack',
                paystackRef: reference,
                metadata: data.metadata,
                orderId: order.id,
            },
        })

        console.log(`Payment failed for order ${order.id}`)

    } catch (error) {
        console.error('Error handling failed payment:', error)
    }
}
