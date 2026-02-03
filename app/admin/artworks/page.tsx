import { getArtworks } from '@/app/actions/artworks'
import { getArtists } from '@/app/actions/artists'
import { ArtworksTable } from '@/components/admin/artworks-table'
import { CreateArtworkButton } from '@/components/admin/create-artwork-button'

export default async function AdminArtworksPage() {
  const [artworksResult, artistsResult] = await Promise.all([
    getArtworks(),
    getArtists('APPROVED'),
  ])

  const artworks = artworksResult.success ? artworksResult.data : []
  const artists = artistsResult.success ? artistsResult.data : []

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-luxury-black mb-2">Artworks</h1>
          <p className="text-gray-600">Manage your artwork collection</p>
        </div>
        <CreateArtworkButton artists={artists} />
      </div>

      <ArtworksTable artworks={artworks} />
    </div>
  )
}
