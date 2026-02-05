import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signupSchema } from '@/lib/validation'
import { signupLimiter, getClientIp, applyRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
    try {
        // Apply rate limiting: 3 signups per hour per IP
        const clientIp = getClientIp(request)
        const rateLimitResponse = await applyRateLimit(signupLimiter, 3, clientIp)
        if (rateLimitResponse) {
            return rateLimitResponse
        }

        const body = await request.json()

        // Validate and sanitize input
        const validation = signupSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            )
        }

        const { email, password, name } = validation.data

        // Optional: Check invite code for additional security
        // Uncomment this if you want to require invite codes
        // const inviteCode = body.inviteCode
        // const validInviteCode = process.env.ADMIN_INVITE_CODE
        // if (inviteCode !== validInviteCode) {
        //   return NextResponse.json(
        //     { error: 'Invalid invite code' },
        //     { status: 403 }
        //   )
        // }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            // Generic error message to prevent user enumeration
            return NextResponse.json(
                { error: 'Unable to create account. Please try a different email.' },
                { status: 400 }
            )
        }

        // Hash password with strong cost factor (12)
        const hashedPassword = await hash(password, 12)

        // Create admin user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'ADMIN',
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Admin account created successfully',
                user,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Signup error:', error)

        // Don't leak error details in production
        const isDev = process.env.NODE_ENV === 'development'
        return NextResponse.json(
            { error: isDev ? 'An error occurred during signup' : 'Unable to create account' },
            { status: 500 }
        )
    }
}
