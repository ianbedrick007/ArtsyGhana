'use client'

import { useState } from 'react'
import { createArtwork } from '@/app/actions/artworks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'

type Artist = {
  id: string
  name: string
}

export function CreateArtworkButton({ artists }: { artists: Artist[] }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      artistId: formData.get('artistId') as string,
      medium: formData.get('medium') as string,
      dimensions: formData.get('dimensions') as string,
      year: parseInt(formData.get('year') as string),
      imageUrl: formData.get('imageUrl') as string,
      type: formData.get('type') as 'ORIGINAL' | 'PRINT',
      category: formData.get('category') as string,
      isAvailable: true,
      isFeatured: formData.get('isFeatured') === 'on',
    }

    const result = await createArtwork(data)

    if (result.success) {
      setOpen(false)
      window.location.reload()
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Artwork
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Artwork</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artistId">Artist *</Label>
              <Select name="artistId" required disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select artist" />
                </SelectTrigger>
                <SelectContent>
                  {artists.map((artist) => (
                    <SelectItem key={artist.id} value={artist.id}>
                      {artist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" name="description" required disabled={isSubmitting} rows={3} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (GHS) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select name="type" required disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORIGINAL">Original</SelectItem>
                  <SelectItem value="PRINT">Print</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="medium">Medium *</Label>
              <Input id="medium" name="medium" required disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                name="dimensions"
                placeholder='e.g. 24" x 36"'
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" disabled={isSubmitting} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL *</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              required
              placeholder="https://..."
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFeatured"
              name="isFeatured"
              className="rounded"
              disabled={isSubmitting}
            />
            <Label htmlFor="isFeatured" className="cursor-pointer">
              Featured on homepage
            </Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Artwork'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
