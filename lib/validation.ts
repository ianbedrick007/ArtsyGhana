import { z } from 'zod'

// Authentication schemas
export const signupSchema = z.object({
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
})

export const loginSchema = z.object({
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z.string().min(1, 'Password is required'),
})

// Artwork schemas
export const createArtworkSchema = z.object({
    title: z.string().min(1).max(200).trim(),
    description: z.string().min(10).max(5000).trim(),
    price: z.number().positive().max(1000000),
    imageUrl: z.string().url().max(500),
    artistName: z.string().min(1).max(100).trim(),
    medium: z.enum(['Painting', 'Sculpture', 'Photography', 'Mixed Media']),
    dimensions: z.string().min(1).max(100).trim(),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    isAvailable: z.boolean().optional().default(true),
    isFeatured: z.boolean().optional().default(false),
})

export const updateArtworkSchema = createArtworkSchema.partial()

// Order schemas
export const updateOrderStatusSchema = z.object({
    status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
})

// Artist schemas
export const createArtistSchema = z.object({
    name: z.string().min(2).max(100).trim(),
    email: z.string().email().toLowerCase().trim(),
    bio: z.string().min(10).max(2000).trim(),
    portfolio: z.string().url().optional(),
    instagram: z.string().max(100).trim().optional(),
})

export const updateArtistSchema = createArtistSchema.partial()

// File upload schema
export const fileUploadSchema = z.object({
    filename: z.string().regex(/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i, 'Invalid filename'),
    size: z.number().max(5 * 1024 * 1024, 'File size must not exceed 5MB'),
    mimetype: z.enum(['image/jpeg', 'image/png', 'image/webp']),
})

// UUID validation
export const uuidSchema = z.string().uuid('Invalid ID format')

// Sanitization helpers
export function sanitizeString(input: string): string {
    return input.replace(/[<>]/g, '').trim()
}

export function sanitizeHtml(input: string): string {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
}

// Error helper
export function formatValidationError(error: z.ZodError): string {
    const firstError = error.errors[0]
    return firstError?.message || 'Validation failed'
}
