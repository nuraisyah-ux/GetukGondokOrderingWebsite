import { getPayloadClient } from '@/lib/payload'

export { default } from '../../page'

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const products = await payload.find({
    collection: 'products',
    overrideAccess: false,
    limit: 100,
    select: { slug: true },
  })

  return products.docs.map((product) => ({ slug: product.slug }))
}
