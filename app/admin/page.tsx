import { getArtworks } from '@/app/actions/artworks'
import { getOrders } from '@/app/actions/orders'
import { prisma } from '@/lib/prisma'
import { KPICard } from '@/components/admin/kpi-card'
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'
import { StatusBadge } from '@/components/admin/status-badge'
import { formatDistanceToNow } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  // Fetch data
  const [artworksResult, ordersResult, paymentsData] = await Promise.all([
    getArtworks(),
    getOrders(),
    prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true },
    }),
  ])

  const artworks = artworksResult.success ? artworksResult.data : []
  const orders = ordersResult.success ? ordersResult.data : []

  // Calculate metrics
  const totalProducts = artworks.length
  const availableProducts = artworks.filter(a => a.isAvailable).length
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length
  const totalRevenue = paymentsData.reduce((sum, p) => sum + p.amount, 0)

  // Recent orders
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="min-h-screen bg-dark-white p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-2">
          Dashboard
        </h1>
        <p className="text-warm-gray uppercase tracking-widest text-sm">
          Overview of your store
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Revenue"
          value={`GHS ${totalRevenue.toLocaleString()}`}
          subtitle="All time"
          icon={DollarSign}
        />
        <KPICard
          title="Total Orders"
          value={totalOrders}
          subtitle={`${pendingOrders} pending`}
          icon={ShoppingCart}
        />
        <KPICard
          title="Products"
          value={totalProducts}
          subtitle={`${availableProducts} available`}
          icon={Package}
        />
        <KPICard
          title="Conversion Rate"
          value="12.5%"
          subtitle="Last 30 days"
          icon={TrendingUp}
          trend={{ value: '2.5%', positive: true }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="glass rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-serif text-charcoal mb-4">
            Recent Orders
          </h2>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-charcoal mb-1">
                      {order.customerName}
                    </p>
                    <p className="text-sm text-warm-gray">
                      GHS {order.totalAmount.toLocaleString()} •{' '}
                      {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-warm-gray text-sm">No orders yet</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="glass rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-serif text-charcoal mb-4">
            Quick Stats
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/50 rounded-lg">
              <span className="text-charcoal font-medium">Today's Orders</span>
              <span className="text-2xl font-serif text-burnished-gold">
                {orders.filter(o => {
                  const today = new Date()
                  const orderDate = new Date(o.createdAt)
                  return orderDate.toDateString() === today.toDateString()
                }).length}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/50 rounded-lg">
              <span className="text-charcoal font-medium">Pending Shipments</span>
              <span className="text-2xl font-serif text-burnished-gold">
                {orders.filter(o => o.status === 'PROCESSING').length}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-white/50 rounded-lg">
              <span className="text-charcoal font-medium">Low Stock Items</span>
              <span className="text-2xl font-serif text-red-500">
                0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
