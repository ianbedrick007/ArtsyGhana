import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { z, ZodSchema } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Verify user is authenticated and has ADMIN role
 */
export async function requireAdmin(): Promise<{ userId: string; email: string } | Response> {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return new Response(
            JSON.stringify({ error: 'Unauthorized - Authentication required' }),
            {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }

    if (session.user.role !== 'ADMIN') {
        return new Response(
            JSON.stringify({ error: 'Forbidden - Admin access required' }),
            {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }

    return {
        userId: session.user.id,
        email: session.user.email,
    }
}

/**
 * Validate request body against a Zod schema
 */
export async function validateRequest<T>(
    request: Request,
    schema: ZodSchema<T>
): Promise<{ data: T } | { error: Response }> {
    try {
        const body = await request.json()
        const data = schema.parse(body)
        return { data }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const firstError = error.errors[0]
            return {
                error: new Response(
                    JSON.stringify({
                        error: 'Validation failed',
                        details: firstError?.message || 'Invalid input',
                    }),
                    {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                    }
                ),
            }
        }

        return {
            error: new Response(
                JSON.stringify({ error: 'Invalid request body' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            ),
        }
    }
}

/**
 * Safe error response - doesn't leak sensitive information
 */
export function errorResponse(
    message: string = 'An error occurred',
    status: number = 500
): Response {
    // In production, log the actual error but return generic message
    const isProduction = process.env.NODE_ENV === 'production'

    return new Response(
        JSON.stringify({
            error: isProduction ? 'An error occurred. Please try again later.' : message,
        }),
        {
            status,
            headers: { 'Content-Type': 'application/json' },
        }
    )
}

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status: number = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
    })
}

/**
 * API handler wrapper with error catching
 */
export function withErrorHandler(
    handler: (request: Request, context?: any) => Promise<Response>
) {
    return async (request: Request, context?: any): Promise<Response> => {
        try {
            return await handler(request, context)
        } catch (error) {
            console.error('API Error:', error)
            return errorResponse()
        }
    }
}

/**
 * Combined middleware: auth + validation
 */
export async function withAuth<T>(
    request: Request,
    schema?: ZodSchema<T>
): Promise<
    | { user: { userId: string; email: string }; data?: T }
    | { error: Response }
> {
    // Check authentication
    const authResult = await requireAdmin()
    if (authResult instanceof Response) {
        return { error: authResult }
    }

    // If schema provided, validate request
    if (schema) {
        const validation = await validateRequest(request, schema)
        if ('error' in validation) {
            return { error: validation.error }
        }
        return { user: authResult, data: validation.data }
    }

    return { user: authResult }
}
