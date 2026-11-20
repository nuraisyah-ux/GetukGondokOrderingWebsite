import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    overrideAccess: false,
    depth: 1,
    limit: 100,
    sort: 'price',
  })

  const products = result.docs.map((product: any) => ({
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    category: product.category,
    price: product.price,
    description: product.description,
    stock: product.stock,
    size: product.size,
    featured: product.featured,
    image: typeof product.image === 'object' && product.image?.url ? product.image.url : null,
  }))

  return Response.json({ products })
}
