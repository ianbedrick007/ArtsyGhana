'use client'

import Image from 'next/image'
import { deleteArtwork } from '@/app/actions/artworks'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

type Artwork = {
  id: string
  title: string
  imageUrl: string
  price: number
  isAvailable: boolean
  isFeatured: boolean
  artist: {
    name: string
  }
}

export function ArtworksTable({ artworks }: { artworks: Artwork[] }) {
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return
    await deleteArtwork(id)
    window.location.reload()
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Artwork
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Artist
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {artworks.map((artwork) => (
            <tr key={artwork.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-16 w-16 flex-shrink-0 relative">
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{artwork.title}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {artwork.artist.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                GHS {artwork.price.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      artwork.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {artwork.isAvailable ? 'Available' : 'Sold'}
                  </span>
                  {artwork.isFeatured && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(artwork.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
