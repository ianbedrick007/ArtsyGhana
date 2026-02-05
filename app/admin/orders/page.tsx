import Link from 'next/link'
import { getOrders } from '@/app/actions/orders'
import { StatusBadge } from '@/components/admin/status-badge'
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-charcoal/5 border-b border-warm-gray/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                  Order #
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-charcoal uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-gray/20">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-charcoal">
                      #{order.orderNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-charcoal">{order.customerName}</p>
                      <p className="text-sm text-warm-gray">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-charcoal">
                      GHS {order.totalAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-warm-gray">
                      {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm text-burnished-gold hover:text-bronze font-medium transition-colors"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-warm-gray">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
