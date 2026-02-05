'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { AddProductModal } from '@/components/admin/add-product-modal'

interface Product {
    id: string
    title: string
    description: string
    price: number
    imageUrl: string | null
    type: string | null
    isAvailable: boolean
    artistName: string | null
}

interface ProductsClientProps {
    products: Product[]
}

export function ProductsClient({ products: initialProducts }: ProductsClientProps) {
    const [products, setProducts] = useState(initialProducts)
    const [deleting, setDeleting] = useState<string | null>(null)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const router = useRouter()

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) {
            return
        }

        setDeleting(id)

        try {
            const response = await fetch(`/api/admin/artworks/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setProducts(products.filter(p => p.id !== id))
            } else {
                alert('Failed to delete product')
            }
        } catch (error) {
            alert('An error occurred while deleting the product')
        } finally {
            setDeleting(null)
        }
    }

    return (
        <div className="min-h-screen bg-dark-white p-6 sm:p-8">
            {/* Add Product Modal */}
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => router.refresh()}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-2">
                        Products
                    </h1>
                    <p className="text-warm-gray uppercase tracking-widest text-sm">
                        Manage your store inventory
                    </p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                </Button>
            </div>

            {/* Products Table */}
            <div className="glass rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-charcoal/5 border-b border-warm-gray/20">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                                    Product
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-charcoal uppercase tracking-widest">
                                    Artist
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-medium text-charcoal uppercase tracking-widest">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-warm-gray/20">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-warm-gray/20">
                                                {product.imageUrl ? (
                                                    <Image
                                                        src={product.imageUrl}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-warm-gray">
                                                        ?
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-charcoal">{product.title}</p>
                                                <p className="text-sm text-warm-gray line-clamp-1">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-charcoal">
                                            GHS {product.price.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-warm-gray capitalize">
                                            {product.type || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isAvailable
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {product.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-charcoal">
                                            {product.artistName || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link href={`/admin/artworks/${product.id}`}>
                                                <Button variant="secondary" size="sm" className="gap-1">
                                                    <Pencil className="w-3 h-3" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="gap-1"
                                                onClick={() => handleDelete(product.id, product.title)}
                                                disabled={deleting === product.id}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                                {deleting === product.id ? 'Deleting...' : 'Delete'}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {products.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-warm-gray mb-4">No products found</p>
                            <Button onClick={() => setIsAddModalOpen(true)}>
                                Add Your First Product
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
