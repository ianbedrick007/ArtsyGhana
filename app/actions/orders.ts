'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth-helpers'
import { orderSchema, updateOrderStatusSchema } from '@/lib/validations'

export async function createOrder(data: unknown) {
  try {
    const validated = orderSchema.parse(data)

    const order = await prisma.order.create({
      data: {
        customerName: validated.customerName,
        customerEmail: validated.customerEmail,
        customerPhone: validated.customerPhone,
        shippingAddress: validated.shippingAddress,
        city: validated.city,
        region: validated.region,
        totalAmount: validated.items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0),
        status: 'PENDING',
        items: {
          create: validated.items.map(item => ({
            artworkId: item.artworkId,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase,
          })),
        },
      },
      include: {
        items: {
          include: {
            artwork: {
              include: {
                artist: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // TODO: Send order confirmation email
    console.log('[v0] Order created:', order.id)

    return { success: true, data: order }
  } catch (error) {
    console.error('[v0] Error creating order:', error)
    return { success: false, error: 'Failed to create order' }
  }
}

export async function updateOrderStatus(data: unknown) {
  try {
    await requireAdmin()
    const validated = updateOrderStatusSchema.parse(data)

    const order = await prisma.order.update({
      where: { id: validated.orderId },
      data: {
        status: validated.status,
        trackingNumber: validated.trackingNumber,
      },
    })

    // TODO: Send status update email to customer
    console.log('[v0] Order status updated:', order.id, validated.status)

    revalidatePath('/admin/orders')
    return { success: true, data: order }
  } catch (error) {
    console.error('[v0] Error updating order status:', error)
    return { success: false, error: 'Failed to update order status' }
  }
}

export async function getOrders(status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') {
  try {
    await requireAdmin()

    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      include: {
        items: {
          include: {
            artwork: {
              select: {
                title: true,
                imageUrl: true,
                artist: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: orders }
  } catch (error) {
    console.error('[v0] Error fetching orders:', error)
    return { success: false, error: 'Failed to fetch orders' }
  }
}

export async function getOrderById(id: string) {
  try {
    await requireAdmin()

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            artwork: {
              include: {
                artist: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!order) {
      return { success: false, error: 'Order not found' }
    }

    return { success: true, data: order }
  } catch (error) {
    console.error('[v0] Error fetching order:', error)
    return { success: false, error: 'Failed to fetch order' }
  }
}

export async function verifyPaystackPayment(reference: string) {
  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    )

    const result = await response.json()

    if (result.status && result.data.status === 'success') {
      console.log('[v0] Payment verified:', reference)
      return { success: true, data: result.data }
    }

    console.log('[v0] Payment verification failed:', reference)
    return { success: false, error: 'Payment verification failed' }
  } catch (error) {
    console.error('[v0] Error verifying payment:', error)
    return { success: false, error: 'Failed to verify payment' }
  }
}
