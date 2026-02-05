import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTransaction, verifyWebhookSignature } from '@/lib/paystack'

/**
 * Handle direct verification requests (GET)
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const reference = searchParams.get('reference')

        if (!reference) {
            return NextResponse.json(
                { error: 'Payment reference is required' },
                { status: 400 }
            )
        }

        const result = await verifyTransaction(reference)

        if (!result.status || !result.data) {
            return NextResponse.json(
                { error: result.message || 'Verification failed' },
                { status: 400 }
            )
        }

        // Update payment in database
        const payment = await prisma.payment.findUnique({
            where: { paystackRef: reference },
            include: { order: true },
        })

        if (!payment) {
            return NextResponse.json(
                { error: 'Payment record not found' },
                { status: 404 }
            )
        }

        // Update payment status
        const updatedPayment = await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: result.data.status === 'success' ? 'SUCCESS' : 'FAILED',
                metadata: {
                    ...((payment.metadata as object) || {}),
                    verifiedAt: new Date().toISOString(),
                    paystackData: result.data,
                },
            },
        })

        // Update order status if payment successful
        if (result.data.status === 'success') {
            await prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'PROCESSING' },
            })
        }

        return NextResponse.json({
            success: true,
            data: {
                status: updatedPayment.status,
                amount: result.data.amount / 100, // Convert from kobo
                reference: result.data.reference,
            },
        })
    } catch (error) {
        console.error('Payment verification error:', error)
        return NextResponse.json(
            { error: 'An error occurred during payment verification' },
            { status: 500 }
        )
    }
}

/**
 * Handle Paystack webhook events (POST)
 */
export async function POST(request: NextRequest) {
    try {
        const signature = request.headers.get('x-paystack-signature')
        const body = await request.text()

        if (!signature) {
            return NextResponse.json(
                { error: 'Missing signature' },
                { status: 400 }
            )
        }

        // Verify webhook signature
        if (!verifyWebhookSignature(signature, body)) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            )
        }

        const event = JSON.parse(body)

        // Handle charge.success event
        if (event.event === 'charge.success') {
            const { reference, amount, status } = event.data

            // Find payment by reference
            const payment = await prisma.payment.findUnique({
                where: { paystackRef: reference },
            })

            if (!payment) {
                console.error(`Payment not found for reference: ${reference}`)
                return NextResponse.json({ received: true })
            }

            // Update payment status
            await prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: status === 'success' ? 'SUCCESS' : 'FAILED',
                    metadata: {
                        ...((payment.metadata as object) || {}),
                        webhookEvent: event,
                        processedAt: new Date().toISOString(),
                    },
                },
            })

            // Update order status if payment successful
            if (status === 'success') {
                await prisma.order.update({
                    where: { id: payment.orderId },
                    data: { status: 'PROCESSING' },
                })
            }
        }

        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook processing error:', error)
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        )
    }
}
