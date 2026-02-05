import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { requireAdmin } from '@/lib/api-middleware'
import { uploadLimiter, getClientIp, applyRateLimit } from '@/lib/rate-limit'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Allowed file types (by MIME type and magic numbers)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Magic numbers for file type validation
const MAGIC_NUMBERS: Record<string, number[]> = {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/webp': [0x52, 0x49, 0x46, 0x46],
}

function validateFileType(buffer: Buffer, mimeType: string): boolean {
    const magicNumber = MAGIC_NUMBERS[mimeType]
    if (!magicNumber) return false

    for (let i = 0; i < magicNumber.length; i++) {
        if (buffer[i] !== magicNumber[i]) return false
    }
    return true
}

function sanitizeFilename(filename: string): string {
    // Remove path traversal attempts and keep only alphanumeric, dash, underscore
    return filename
        .replace(/\.\./g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '-')
        .substring(0, 100)
}

export async function POST(request: NextRequest) {
    try {
        // Require authentication
        const authResult = await requireAdmin()
        if (authResult instanceof Response) {
            return authResult
        }

        // Apply rate limiting: 10 uploads per hour
        const clientIp = getClientIp(request)
        const rateLimitResponse = await applyRateLimit(uploadLimiter, 10, clientIp)
        if (rateLimitResponse) {
            return rateLimitResponse
        }

        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            )
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'File size exceeds 5MB limit' },
                { status: 400 }
            )
        }

        // Validate MIME type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
                { status: 400 }
            )
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Validate file type using magic numbers (prevents MIME type spoofing)
        if (!validateFileType(buffer, file.type)) {
            return NextResponse.json(
                { error: 'File type validation failed' },
                { status: 400 }
            )
        }

        // Sanitize filename
        const safeFilename = sanitizeFilename(file.name)

        // Upload to Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'artsyghana/products',
                    resource_type: 'image',
                    allowed_formats: ['jpg', 'png', 'webp'],
                    max_bytes: MAX_FILE_SIZE,
                    public_id: `${Date.now()}-${safeFilename}`,
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(buffer)
        })

        const result = uploadResponse as any

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        })
    } catch (error) {
        console.error('Upload error:', error)

        const isDev = process.env.NODE_ENV === 'development'
        return NextResponse.json(
            { error: isDev ? String(error) : 'Failed to upload image' },
            { status: 500 }
        )
    }
}
