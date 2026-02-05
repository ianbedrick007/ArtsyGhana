const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_TEST_SECRET_KEY

if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key is not configured')
}

interface InitializeTransactionParams {
    email: string
    amount: number // in kobo (smallest currency unit)
    reference?: string
    metadata?: Record<string, any>
    callback_url?: string
}

interface InitializeTransactionResponse {
    status: boolean
    message: string
    data?: {
        authorization_url: string
        access_code: string
        reference: string
    }
}

interface VerifyTransactionResponse {
    status: boolean
    message: string
    data?: {
        id: number
        status: string
        reference: string
        amount: number
        currency: string
        paid_at: string
        customer: {
            email: string
        }
        metadata?: Record<string, any>
    }
}

/**
 * Initialize a Paystack transaction
 */
export async function initializeTransaction(
    params: InitializeTransactionParams
): Promise<InitializeTransactionResponse> {
    try {
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        })

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Paystack initialization error:', error)
        throw new Error('Failed to initialize payment')
    }
}

/**
 * Verify a Paystack transaction
 */
export async function verifyTransaction(
    reference: string
): Promise<VerifyTransactionResponse> {
    try {
        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        )

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Paystack verification error:', error)
        throw new Error('Failed to verify payment')
    }
}

/**
 * Verify Paystack webhook signature
 */
export function verifyWebhookSignature(
    signature: string,
    payload: string
): boolean {
    const crypto = require('crypto')
    const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(payload)
        .digest('hex')

    return hash === signature
}

// Alias for consistency
export const verifyPaystackSignature = verifyWebhookSignature

/**
 * Generate a unique payment reference
 */
export function generatePaymentReference(prefix = 'PMT'): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000000)
    return `${prefix}-${timestamp}-${random}`
}
