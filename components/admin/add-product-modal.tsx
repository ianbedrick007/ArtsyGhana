'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X, Upload, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface AddProductModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        artistName: '',
        medium: 'Painting',
        dimensions: '',
        year: new Date().getFullYear().toString(),
        imageUrl: '',
        isAvailable: true,
    })
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>('')
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB')
            return
        }

        setSelectedFile(file)
        setError('')

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload immediately
        await uploadImage(file)
    }

    const uploadImage = async (file: File) => {
        setUploading(true)
        setError('')

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            // Update form data with uploaded URL
            setFormData(prev => ({ ...prev, imageUrl: data.url }))
        } catch (err: any) {
            setError(err.message || 'Failed to upload image')
            setSelectedFile(null)
            setImagePreview('')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!formData.imageUrl) {
            setError('Please upload an image')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/admin/artworks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    year: parseInt(formData.year),
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to create product')
                return
            }

            // Success - close modal and refresh
            onSuccess()
            onClose()
            router.refresh()

            // Reset form
            setFormData({
                title: '',
                description: '',
                price: '',
                artistName: '',
                medium: 'Painting',
                dimensions: '',
                year: new Date().getFullYear().toString(),
                imageUrl: '',
                isAvailable: true,
            })
            setSelectedFile(null)
            setImagePreview('')
        } catch (err) {
            setError('An error occurred while creating the product')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="glass rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-warm-gray/20">
                    <h2 className="text-2xl font-serif text-charcoal">Add New Product</h2>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-2 hover:bg-warm-gray/10 rounded-lg transition-colors"
                        disabled={uploading || loading}
                    >
                        <X className="w-5 h-5 text-warm-gray" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Image Upload */}
                    <div>
                        <Label className="text-charcoal font-medium mb-2">
                            Product Image *
                        </Label>
                        <div className="mt-2">
                            {imagePreview ? (
                                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-warm-gray/10">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        className="object-contain"
                                    />
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        </div>
                                    )}
                                    {!uploading && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedFile(null)
                                                setImagePreview('')
                                                setFormData(prev => ({ ...prev, imageUrl: '' }))
                                            }}
                                            aria-label="Remove image"
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-warm-gray/30 rounded-lg cursor-pointer hover:border-burnished-gold transition-colors bg-white/50">
                                    <Upload className="w-12 h-12 text-warm-gray mb-2" />
                                    <span className="text-sm text-warm-gray">Click to upload image</span>
                                    <span className="text-xs text-warm-gray mt-1">PNG, JPG up to 5MB</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        disabled={uploading || loading}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <Label htmlFor="title" className="text-charcoal font-medium mb-2">
                                Product Title *
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                disabled={loading || uploading}
                                placeholder="e.g., Sunset Over Accra"
                                className="bg-white/50"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <Label htmlFor="description" className="text-charcoal font-medium mb-2">
                                Description *
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                disabled={loading || uploading}
                                rows={4}
                                placeholder="Describe the artwork..."
                                className="bg-white/50"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <Label htmlFor="price" className="text-charcoal font-medium mb-2">
                                Price (GHS) *
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                disabled={loading || uploading}
                                placeholder="0.00"
                                className="bg-white/50"
                            />
                        </div>

                        {/* Artist Name */}
                        <div>
                            <Label htmlFor="artistName" className="text-charcoal font-medium mb-2">
                                Artist Name *
                            </Label>
                            <Input
                                id="artistName"
                                name="artistName"
                                value={formData.artistName}
                                onChange={handleChange}
                                required
                                disabled={loading || uploading}
                                placeholder="e.g., Kwame Mensah"
                                className="bg-white/50"
                            />
                        </div>

                        {/* Medium */}
                        <div>
                            <Label htmlFor="medium" className="text-charcoal font-medium mb-2">
                                Medium *
                            </Label>
                            <select
                                id="medium"
                                name="medium"
                                aria-label="Select medium type"
                                value={formData.medium}
                                onChange={handleChange}
                                disabled={loading || uploading}
                                className="w-full px-3 py-2 bg-white/50 border border-warm-gray/30 rounded-md focus:outline-none focus:ring-2 focus:ring-burnished-gold"
                            >
                                <option value="Painting">Painting</option>
                                <option value="Sculpture">Sculpture</option>
                                <option value="Photography">Photography</option>
                                <option value="Mixed Media">Mixed Media</option>
                            </select>
                        </div>

                        {/* Dimensions */}
                        <div>
                            <Label htmlFor="dimensions" className="text-charcoal font-medium mb-2">
                                Dimensions *
                            </Label>
                            <Input
                                id="dimensions"
                                name="dimensions"
                                value={formData.dimensions}
                                onChange={handleChange}
                                required
                                disabled={loading || uploading}
                                placeholder="e.g., 24 x 36 inches"
                                className="bg-white/50"
                            />
                        </div>

                        {/* Year */}
                        <div>
                            <Label htmlFor="year" className="text-charcoal font-medium mb-2">
                                Year *
                            </Label>
                            <Input
                                id="year"
                                name="year"
                                type="number"
                                value={formData.year}
                                onChange={handleChange}
                                required
                                disabled={loading || uploading}
                                placeholder="2024"
                                className="bg-white/50"
                            />
                        </div>

                        {/* Availability */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isAvailable"
                                    checked={formData.isAvailable}
                                    onChange={handleChange}
                                    disabled={loading || uploading}
                                    className="w-4 h-4 text-burnished-gold focus:ring-burnished-gold border-warm-gray rounded"
                                />
                                <span className="text-charcoal font-medium">Available for sale</span>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-warm-gray/20">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading || uploading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || uploading || !formData.imageUrl}
                            className="flex-1 bg-charcoal hover:bg-charcoal/90"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Product'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
