import { prisma } from '@/lib/prisma'
import { KPICard } from '@/components/admin/kpi-card'
import { DollarSign, ShoppingCart, TrendingUp, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
    //  Aggregate analytics data
    const [totalRevenue, orderStats, recentOrders, topProducts] = await Promise.all([
        prisma.payment.aggregate({
            where: { status: 'SUCCESS' },
            _sum: { amount: true },
        }),
        prisma.order.groupBy({
            by: ['status'],
            _count: true,
        }),
        prisma.order.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
            },
            select: { total: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.orderItem.groupBy({
            by: ['artworkId'],
            _sum: { quantity: true, price: true },
            _count: true,
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 5,
        }),
    ])

    const revenue = totalRevenue._sum.amount || 0
    const totalOrders = orderStats.reduce((sum, stat) => sum + stat._count, 0)
    const completedOrders = orderStats.find(s => s.status === 'DELIVERED')?._count || 0
    const avgOrderValue = totalOrders > 0 ? revenue / totalOrders : 0

    // Calculate revenue for last 30 days
    const last30DaysRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0)

    return (
        <div className="min-h-screen bg-dark-white p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-2">
                    Analytics
                </h1>
                <p className="text-warm-gray uppercase tracking-widest text-sm">
                    Sales insights and performance
                </p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard
                    title="Total Revenue"
                    value={`GHS ${revenue.toLocaleString()}`}
                    subtitle="All time"
                    icon={DollarSign}
                />
                <KPICard
                    title="Total Orders"
                    value={totalOrders}
                    subtitle={`${completedOrders} completed`}
                    icon={ShoppingCart}
                />
                <KPICard
                    title="Avg Order Value"
                    value={`GHS ${avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                    subtitle="Per order"
                    icon={TrendingUp}
                />
                <KPICard
                    title="Last 30 Days"
                    value={`GHS ${last30DaysRevenue.toLocaleString()}`}
                    subtitle={`${recentOrders.length} orders`}
                    icon={Calendar}
                />
            </div>

            {/* Charts and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Breakdown */}
                <div className="glass rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-serif text-charcoal mb-6">
                        Order Status Breakdown
                    </h2>
                    <div className="space-y-4">
                        {orderStats.map((stat) => (
                            <div key={stat.status} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${stat.status === 'DELIVERED' ? 'bg-green-500' :
                                            stat.status === 'PROCESSING' ? 'bg-blue-500' :
                                                stat.status === 'SHIPPED' ? 'bg-purple-500' :
                                                    stat.status === 'PENDING' ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                        }`} />
                                    <span className="text-charcoal font-medium">{stat.status}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-warm-gray">{stat._count} orders</span>
                                    <span className="text-sm text-burnished-gold font-medium">
                                        {((stat._count / totalOrders) * 100).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="glass rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-serif text-charcoal mb-6">
                        Top Selling Products
                    </h2>
                    <div className="space-y-4">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, index) => (
                                <div key={product.artworkId} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-burnished-gold font-serif text-lg">
                                            #{index + 1}
                                        </span>
                                        <div>
                                            <p className="font-medium text-charcoal">
                                                Product ID: {product.artworkId.slice(0, 8)}...
                                            </p>
                                            <p className="text-sm text-warm-gray">
                                                {product._sum.quantity} units sold
                                            </p>
                                        </div>
                                    </div>
                                    <span className="font-medium text-charcoal">
                                        GHS {(product._sum.price || 0).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-warm-gray text-sm">No sales data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
