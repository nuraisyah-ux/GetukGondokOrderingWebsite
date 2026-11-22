import { getPayloadClient } from '@/lib/payload'
import { isSupabaseConfigured, selectRows } from '@/lib/supabase/rest'
import { mapProdukRow, PRODUK_COLUMNS, type ProdukRow } from '@/lib/store/product-catalog'

export const dynamic = 'force-dynamic'

// Kode Payload lama dipertahankan sebagai cadangan bila environment variable Supabase belum diisi.
async function legacyPayloadProducts() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    overrideAccess: false,
    depth: 1,
    limit: 100,
    sort: 'price',
  })

  return result.docs.map((product: any) => ({
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
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    const products = await legacyPayloadProducts()
    return Response.json({ products }, { headers: { 'x-data-source': 'payload-legacy' } })
  }

  try {
    const rows = await selectRows<ProdukRow>(
      'produk',
      `select=${PRODUK_COLUMNS.replace(/\s/g, '')}&order=id_produk.asc`,
    )
    return Response.json(
      { products: rows.map(mapProdukRow) },
      { headers: { 'x-data-source': 'supabase' } },
    )
  } catch {
    return Response.json(
      { products: [], error: 'Produk gagal dimuat dari Supabase.' },
      { status: 502 },
    )
  }
}
