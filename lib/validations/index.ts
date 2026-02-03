import { z } from 'zod'

// Artist Application Schema
export const artistApplicationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters').max(20),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(1000),
  instagramHandle: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
  statement: z.string().min(100, 'Artist statement must be at least 100 characters').max(2000),
})

export type ArtistApplicationInput = z.infer<typeof artistApplicationSchema>

// Artwork Schema
export const artworkSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  price: z.number().min(0, 'Price must be positive').max(2000, 'Price cannot exceed GHS 2000 per commission policy'),
  artistId: z.string().cuid('Invalid artist ID'),
  medium: z.string().min(2).max(100),
  dimensions: z.string().max(100).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  imageUrl: z.string().url('Invalid image URL'),
  type: z.enum(['ORIGINAL', 'PRINT']),
  category: z.string().max(50).optional(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

export type ArtworkInput = z.infer<typeof artworkSchema>

// Exhibition Schema
export const exhibitionSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  curatorNotes: z.string().max(5000).optional(),
  startDate: z.date().or(z.string().pipe(z.coerce.date())),
  endDate: z.date().or(z.string().pipe(z.coerce.date())),
  location: z.string().max(200).optional(),
  featuredImageUrl: z.string().url('Invalid image URL').optional(),
  status: z.enum(['UPCOMING', 'LIVE', 'ENDED']).default('UPCOMING'),
})

export type ExhibitionInput = z.infer<typeof exhibitionSchema>

// Exhibition Room Schema
export const exhibitionRoomSchema = z.object({
  name: z.string().min(2, 'Room name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  exhibitionId: z.string().cuid('Invalid exhibition ID'),
  modelUrl: z.string().url('Invalid 3D model URL'),
  order: z.number().int().min(0).default(0),
})

export type ExhibitionRoomInput = z.infer<typeof exhibitionRoomSchema>

// Hotspot Schema
export const hotspotSchema = z.object({
  roomId: z.string().cuid('Invalid room ID'),
  artworkId: z.string().cuid('Invalid artwork ID'),
  positionX: z.number(),
  positionY: z.number(),
  positionZ: z.number(),
  rotationY: z.number().default(0),
  scale: z.number().positive().default(1),
})

export type HotspotInput = z.infer<typeof hotspotSchema>

// Order Schema
export const orderSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 characters').max(20),
  shippingAddress: z.string().min(10, 'Shipping address must be at least 10 characters').max(500),
  city: z.string().min(2).max(100),
  region: z.string().min(2).max(100),
  items: z.array(z.object({
    artworkId: z.string().cuid('Invalid artwork ID'),
    quantity: z.number().int().min(1).max(10),
    priceAtPurchase: z.number().positive(),
  })).min(1, 'Order must contain at least one item'),
})

export type OrderInput = z.infer<typeof orderSchema>

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>

// Update Order Status Schema
export const updateOrderStatusSchema = z.object({
  orderId: z.string().cuid('Invalid order ID'),
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  trackingNumber: z.string().optional(),
})

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>

// Update Artist Status Schema
export const updateArtistStatusSchema = z.object({
  artistId: z.string().cuid('Invalid artist ID'),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
})

export type UpdateArtistStatusInput = z.infer<typeof updateArtistStatusSchema>
