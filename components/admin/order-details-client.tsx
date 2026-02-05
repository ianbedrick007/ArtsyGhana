'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/admin/status-badge'
import { ArrowLeft } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface OrderDetailsClientProps {
    order: any
}

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export function OrderDetailsClient({ order: initialOrder }: OrderDetailsClientProps) {
    const [order, setOrder] = useState(initialOrder)
    const [updating, setUpdating] = useState(false)
    const router = useRouter()

    const handleStatusChange = async (newStatus: string) => {
        if (!confirm(`Change order status to ${newStatus}?`)) {
            return
        }

        setUpdating(true)

        try {
            const response = await fetch(`/api/admin/orders/${order.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                const data = await response.json()
                setOrder({ ...order, status: data.data.status })
            } else {
                alert('Failed to update order status')
            }
        } catch (error) {
            alert('An error occurred while updating the order')
        } finally {
            setUpdating(false)
        }
    }

    return (
        <div className="min-h-screen bg-dark-white p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin/orders">
                    <Button variant="ghost" className="gap-2 mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Orders
                    </Button>
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-2">
                            Order #{order.orderNumber}
                        </h1>
                        <p className="text-warm-gray text-sm">
                            Placed {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-serif text-charcoal mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-4 p-4 bg-white/50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-charcoal">{item.artwork?.title || 'Unknown Product'}</p>
                                        <p className="text-sm text-warm-gray">
                                            Quantity: {item.quantity} × GHS {item.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <p className="font-medium text-charcoal">
                                        GHS {(item.quantity * item.price).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-warm-gray/20">
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-serif text-charcoal">Total</span>
                                <span className="font-medium text-charcoal">
                                    GHS {order.totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    {order.payment && (
                        <div className="glass rounded-lg p-6 shadow-lg">
                            <h2 className="text-xl font-serif text-charcoal mb-4">Payment Information</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-warm-gray">Status</span>
                                    <StatusBadge status={order.payment.status} />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-warm-gray">Method</span>
                                    <span className="text-charcoal capitalize">{order.payment.method}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-warm-gray">Amount</span>
                                    <span className="text-charcoal">
                                        {order.payment.currency} {order.payment.amount.toLocaleString()}
                                    </span>
                                </div>
                                {order.payment.paystackRef && (
                                    <div className="flex justify-between">
                                        <span className="text-warm-gray">Reference</span>
                                        <span className="text-charcoal font-mono text-xs">{order.payment.paystackRef}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Customer Info & Actions */}
                <div className="space-y-6">
                    {/* Customer Details */}
                    <div className="glass rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-serif text-charcoal mb-4">Customer</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-warm-gray uppercase tracking-wider mb-1">Name</p>
                                <p className="text-charcoal">{order.customerName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-warm-gray uppercase tracking-wider mb-1">Email</p>
                                <p className="text-charcoal">{order.customerEmail}</p>
                            </div>
                            <div>
                                <p className="text-xs text-warm-gray uppercase tracking-wider mb-1">Phone</p>
                                <p className="text-charcoal">{order.customerPhone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="glass rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-serif text-charcoal mb-4">Shipping Address</h2>
                        <p className="text-charcoal whitespace-pre-line">
                            {order.shippingAddress || 'No address provided'}
                        </p>
                    </div>

                    {/* Update Status */}
                    <div className="glass rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-serif text-charcoal mb-4">Update Status</h2>
                        <div className="space-y-2">
                            {STATUS_OPTIONS.map((status) => (
                                <Button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    disabled={updating || order.status === status}
                                    variant={order.status === status ? 'default' : 'outline'}
                                    className="w-full justify-start"
                                    size="sm"
                                >
                                    {status}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
