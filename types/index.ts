import { Prisma } from '@prisma/client'

// Artwork with artist relation
export type ArtworkWithArtist = Prisma.ArtworkGetPayload<{
  include: { artist: true }
}>

// Exhibition with rooms and artworks
export type ExhibitionWithDetails = Prisma.ExhibitionGetPayload<{
  include: {
    rooms: true
    exhibitionArtworks: {
      include: {
        artwork: {
          include: {
            artist: true
          }
        }
      }
    }
  }
}>

// Order with items and artwork details
export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        artwork: {
          include: {
            artist: true
          }
        }
      }
    }
  }
}>

// Artist with artworks
export type ArtistWithArtworks = Prisma.ArtistGetPayload<{
  include: {
    artworks: true
  }
}>

// Cart item type for Zustand store
export interface CartItem {
  id: string
  title: string
  artist: string
  price: number
  image: string
  quantity: number
}

// Paystack types
export interface PaystackConfig {
  reference: string
  email: string
  amount: number
  publicKey: string
}

export interface PaystackResponse {
  status: boolean
  message: string
  data?: {
    reference: string
    status: string
    amount: number
  }
}
