import { getPayloadClient } from '@/lib/payload'
import { requireProductManager } from '@/lib/staff-auth'

const editableFields = [
  'name',
  'description',
  'price',
  'stock',
  'size',
  'featured',
  'category',
] as const

function publicProduct(product: any) {
  return {
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
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireProductManager(request)
    const { id } = await params
    const body = await request.json()
    const payload = await getPayloadClient()
    const current = await payload.findByID({
      collection: 'products',
      id,
      overrideAccess: false,
      user,
    })

    let data: Record<string, unknown> = {}
    if (typeof body.stockDelta === 'number' && Number.isInteger(body.stockDelta)) {
      data.stock = Math.max(0, current.stock + body.stockDelta)
    } else {
      for (const field of editableFields) {
        if (typeof body[field] !== 'undefined') data[field] = body[field]
      }

      if (typeof data.name === 'string') data.name = data.name.trim()
      if (typeof data.description === 'string') data.description = data.description.trim()
      if (typeof data.price === 'number' && (!Number.isFinite(data.price) || data.price < 0)) {
        return Response.json({ error: 'Harga tidak valid.' }, { status: 400 })
      }
      if (typeof data.stock === 'number' && (!Number.isInteger(data.stock) || data.stock < 0)) {
        return Response.json(
          { error: 'Stok harus berupa bilangan bulat positif.' },
          { status: 400 },
        )
      }
      if (data.category && !['getuk', 'jajanan'].includes(String(data.category))) {
        return Response.json({ error: 'Kategori tidak valid.' }, { status: 400 })
      }
    }

    if (!Object.keys(data).length) {
      return Response.json({ error: 'Tidak ada perubahan yang valid.' }, { status: 400 })
    }

    const updated = await payload.update({
      collection: 'products',
      id,
      data,
      overrideAccess: false,
      user,
    })

    return Response.json({ product: publicProduct(updated) })
  } catch (error) {
    const status = error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 500
    return Response.json(
      { error: status === 401 ? 'Silakan login sebagai admin.' : 'Produk gagal diperbarui.' },
      { status },
    )
  }
}
