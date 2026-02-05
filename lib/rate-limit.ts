import { LRUCache } from 'lru-cache'

type RateLimitOptions = {
    interval: number // Time window in milliseconds
    uniqueTokenPerInterval: number // Max number of unique tokens to track
}

export class RateLimiter {
    private tokenCache: LRUCache<string, number[]>

    constructor(private options: RateLimitOptions) {
        this.tokenCache = new LRUCache({
            max: options.uniqueTokenPerInterval || 500,
            ttl: options.interval || 60000,
        })
    }

    check(limit: number, token: string): { success: boolean; remaining: number; reset: number } {
        const now = Date.now()
        const tokenCount = this.tokenCache.get(token) || []

        // Remove timestamps outside the current window
        const validTokens = tokenCount.filter(timestamp => now - timestamp < this.options.interval)

        if (validTokens.length >= limit) {
            const oldestToken = validTokens[0]
            const reset = oldestToken + this.options.interval

            return {
                success: false,
                remaining: 0,
                reset: Math.ceil(reset / 1000), // Convert to seconds
            }
        }

        // Add current timestamp
        validTokens.push(now)
        this.tokenCache.set(token, validTokens)

        return {
            success: true,
            remaining: limit - validTokens.length,
            reset: Math.ceil((now + this.options.interval) / 1000),
        }
    }
}

// Pre-configured rate limiters
export const loginLimiter = new RateLimiter({
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 500,
})

export const signupLimiter = new RateLimiter({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 500,
})

export const uploadLimiter = new RateLimiter({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 500,
})

export const apiLimiter = new RateLimiter({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
})

// Helper to get client IP from request
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')

    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }

    if (realIp) {
        return realIp
    }

    return 'unknown'
}

// Helper to apply rate limit and return response if exceeded
export async function applyRateLimit(
    limiter: RateLimiter,
    limit: number,
    token: string
): Promise<Response | null> {
    const result = limiter.check(limit, token)

    if (!result.success) {
        return new Response(
            JSON.stringify({
                error: 'Too many requests. Please try again later.',
                retryAfter: result.reset,
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': result.reset.toString(),
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': result.reset.toString(),
                },
            }
        )
    }

    return null
}
