import { getArtists } from '@/app/actions/artists'
import { ArtistsTable } from '@/components/admin/artists-table'

export default async function AdminArtistsPage() {
  const artistsResult = await getArtists()
  const artists = artistsResult.success ? artistsResult.data : []

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-luxury-black mb-2">Artists</h1>
          <p className="text-gray-600">Manage artist applications and profiles</p>
        </div>
      </div>

      <ArtistsTable artists={artists} />
    </div>
  )
}
