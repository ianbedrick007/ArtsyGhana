'use client'

import { useState, useRef } from 'react'
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
import { Plus, Upload, X } from 'lucide-react'
import Image from 'next/image'

type Artist = {
  id: string
  name: string
}

export function CreateArtworkButton({ artists }: { artists: Artist[] }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const removeFile = () => {
    setFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      alert('Please select an image')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Upload Image
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Failed to upload image')
      }

      const imageUrl = uploadData.url

      // 2. Create Artwork
      const formData = new FormData(e.currentTarget)
      const data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        artistId: formData.get('artistId') as string,
        medium: formData.get('medium') as string,
        dimensions: formData.get('dimensions') as string,
        year: parseInt(formData.get('year') as string),
        imageUrl: imageUrl, // Use the uploaded URL
        type: formData.get('type') as 'ORIGINAL' | 'PRINT',
        // category: formData.get('category') as string, // Removed category
        isAvailable: true,
        isFeatured: formData.get('isFeatured') === 'on',
      }

      const result = await createArtwork(data)

      if (result.success) {
        setOpen(false)
        window.location.reload()
      } else {
        alert('Failed to create artwork: ' + result.error)
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
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

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Artwork Image *</Label>
            <div className="flex items-center gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-gray-400 transition-colors flex flex-col items-center justify-center w-full h-32 bg-gray-50"
              >
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <Image src={previewUrl} alt="Preview" fill className="object-contain" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile()
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload image</span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
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
