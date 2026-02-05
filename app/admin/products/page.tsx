import { getArtworks } from '@/app/actions/artworks'
import { ProductsClient } from '@/components/admin/products-client'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
    const artworksResult = await getArtworks()
    const products = artworksResult.success ? artworksResult.data : []

    return <ProductsClient products={products} />
}
