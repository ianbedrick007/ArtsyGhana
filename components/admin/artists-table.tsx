'use client'

import { useState } from 'react'
import { updateArtistStatus } from '@/app/actions/artists'
import { Button } from '@/components/ui/button'
import { Check, X } from 'lucide-react'

type Artist = {
  id: string
  name: string
  email: string
  phone: string
  status: string
  createdAt: Date
  artworks: { id: string }[]
}

export function ArtistsTable({ artists }: { artists: Artist[] }) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleStatusUpdate = async (artistId: string, status: 'APPROVED' | 'REJECTED') => {
    setIsUpdating(artistId)
    await updateArtistStatus({ artistId, status })
    setIsUpdating(null)
    window.location.reload()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Artist
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Artworks
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
          {artists.map((artist) => (
            <tr key={artist.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{artist.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(artist.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{artist.email}</div>
                <div className="text-sm text-gray-500">{artist.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {artist.artworks?.length || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    artist.status
                  )}`}
                >
                  {artist.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                {artist.status === 'PENDING' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(artist.id, 'APPROVED')}
                      disabled={isUpdating === artist.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleStatusUpdate(artist.id, 'REJECTED')}
                      disabled={isUpdating === artist.id}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                {artist.status !== 'PENDING' && (
                  <span className="text-gray-400">No actions</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
