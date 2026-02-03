import { getExhibitions } from '@/app/actions/exhibitions'

export default async function AdminExhibitionsPage() {
  const exhibitionsResult = await getExhibitions()
  const exhibitions = exhibitionsResult.success ? exhibitionsResult.data : []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-luxury-black mb-2">Exhibitions</h1>
        <p className="text-gray-600">Manage virtual exhibitions and galleries</p>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600 mb-4">
          {exhibitions.length} exhibitions created
        </p>
        <p className="text-sm text-gray-500">
          Exhibition management interface coming soon
        </p>
      </div>
    </div>
  )
}
