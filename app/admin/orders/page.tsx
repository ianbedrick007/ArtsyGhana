import { getOrders } from '@/app/actions/orders'
import { OrdersTable } from '@/components/admin/orders-table'

export default async function AdminOrdersPage() {
  const ordersResult = await getOrders()
  const orders = ordersResult.success ? ordersResult.data : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-luxury-black mb-2">Orders</h1>
        <p className="text-gray-600">Manage customer orders and shipments</p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  )
}
