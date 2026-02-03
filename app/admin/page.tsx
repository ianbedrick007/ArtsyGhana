import { getArtists } from '@/app/actions/artists'
import { getArtworks } from '@/app/actions/artworks'
import { getExhibitions } from '@/app/actions/exhibitions'
import { getOrders } from '@/app/actions/orders'
import { Users, Image as ImageIcon, GalleryThumbnails, ShoppingBag } from 'lucide-react'

export default async function AdminDashboardPage() {
  const [artistsResult, artworksResult, exhibitionsResult, ordersResult] = await Promise.all([
    getArtists(),
    getArtworks(),
    getExhibitions(),
    getOrders(),
  ])

  const artists = artistsResult.success ? artistsResult.data : []
  const artworks = artworksResult.success ? artworksResult.data : []
  const exhibitions = exhibitionsResult.success ? exhibitionsResult.data : []
  const orders = ordersResult.success ? ordersResult.data : []

  const pendingArtists = artists.filter(a => a.status === 'PENDING').length
  const liveExhibitions = exhibitions.filter(e => e.status === 'LIVE').length
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length

  const stats = [
    {
      name: 'Total Artists',
      value: artists.length,
      subtext: `${pendingArtists} pending`,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Artworks',
      value: artworks.length,
      subtext: `${artworks.filter(a => a.isAvailable).length} available`,
      icon: ImageIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Exhibitions',
      value: exhibitions.length,
      subtext: `${liveExhibitions} live`,
      icon: Gallery,
      color: 'bg-purple-500',
    },
    {
      name: 'Orders',
      value: orders.length,
      subtext: `${pendingOrders} pending`,
      icon: ShoppingBag,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-luxury-black mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 mb-1">{stat.name}</div>
            <div className="text-xs text-gray-500">{stat.subtext}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Artists */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Artist Applications</h2>
          </div>
          <div className="p-6">
            {pendingArtists > 0 ? (
              <div className="space-y-4">
                {artists
                  .filter(a => a.status === 'PENDING')
                  .slice(0, 5)
                  .map((artist) => (
                    <div key={artist.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{artist.name}</p>
                        <p className="text-sm text-gray-500">{artist.email}</p>
                      </div>
                      <a
                        href={`/admin/artists`}
                        className="text-sm text-luxury-gold hover:text-luxury-black transition-colors"
                      >
                        Review →
                      </a>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No pending applications</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="p-6">
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-500">
                        GHS {order.totalAmount.toLocaleString()} • {order.status}
                      </p>
                    </div>
                    <a
                      href={`/admin/orders`}
                      className="text-sm text-luxury-gold hover:text-luxury-black transition-colors"
                    >
                      View →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
