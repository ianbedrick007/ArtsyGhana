import Link from 'next/link'
import { getOrders } from '@/app/actions/orders'
import { StatusBadge } from '@/components/admin/status-badge'
import { OrdersTable } from '@/components/admin/orders-table'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const ordersResult = await getOrders()
  const orders = ordersResult.success ? ordersResult.data : []

  return (
    <div className="min-h-screen bg-dark-white p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-2">
          Orders
        </h1>
        <p className="text-warm-gray uppercase tracking-widest text-sm">
          Manage customer orders
        </p>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-lg shadow-lg overflow-hidden">
        <OrdersTable orders={orders} />
      </div>
    </div>
  )
}
