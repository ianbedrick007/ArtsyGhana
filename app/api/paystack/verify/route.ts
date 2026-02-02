import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { reference } = await request.json()

        if (!reference) {
            return NextResponse.json(
                { message: 'Reference is required' },
                { status: 400 }
            )
        }

        const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${paystackSecretKey}`,
                },
            }
        )

        const data = await response.json()

        if (data.status && data.data.status === 'success') {
            // Here you would typically:
            // 1. Update order status in database
            // 2. Trigger email notifications
            // 3. Clear the user's cart

            return NextResponse.json({
                success: true,
                message: 'Transaction verified successfully',
                data: data.data
            })
        }

        return NextResponse.json(
            { success: false, message: 'Transaction verification failed' },
            { status: 400 }
        )
    } catch (error) {
        console.error('Paystack verification error:', error)
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        )
    }
}
