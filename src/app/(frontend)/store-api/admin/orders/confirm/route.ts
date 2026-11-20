import type { PayloadRequest } from 'payload'
import { getPayloadClient } from '@/lib/payload'
import { requireProductManager } from '@/lib/staff-auth'

type ConfirmationItem = { productId: string; quantity: number }

export async function POST(request: Request) {
  const payload = await getPayloadClient()
  let transactionID: null | number | string = null

  try {
    const user = await requireProductManager(request)
    const body = await request.json()
    const orderNumber = typeof body.orderNumber === 'string' ? body.orderNumber.trim() : ''
    const items: ConfirmationItem[] = Array.isArray(body.items)
      ? body.items.filter(
          (item: any) =>
            typeof item?.productId === 'string' &&
            Number.isInteger(item?.quantity) &&
            item.quantity > 0,
        )
      : []

    if (!/^GG-[A-Z0-9-]+$/i.test(orderNumber) || !items.length) {
      return Response.json({ error: 'Data konfirmasi pesanan tidak valid.' }, { status: 400 })
    }

    const existing = await payload.find({
      collection: 'stock-movements',
      where: { orderNumber: { equals: orderNumber } },
      limit: 1,
      depth: 0,
      overrideAccess: false,
      user,
    })
    if (existing.docs.length) {
      return Response.json({ success: true, alreadyApplied: true })
    }

    transactionID = await payload.db.beginTransaction()
    const transactionReq = {
      payload,
      transactionID: transactionID ?? undefined,
      user,
    } as Partial<PayloadRequest>

    const adjustments = []
    for (const item of items) {
      const product = await payload.findByID({
        collection: 'products',
        id: item.productId,
        depth: 0,
        overrideAccess: false,
        req: transactionReq,
        user,
      })

      if (product.stock < item.quantity) {
        throw new Error(`Stok ${product.name} tidak mencukupi.`)
      }

      adjustments.push({
        product: product.id,
        quantity: item.quantity,
        previousStock: product.stock,
        newStock: product.stock - item.quantity,
      })
    }

    await payload.create({
      collection: 'stock-movements',
      data: {
        orderNumber,
        appliedAt: new Date().toISOString(),
        items: adjustments,
      },
      overrideAccess: false,
      req: transactionReq,
      user,
    })

    for (const adjustment of adjustments) {
      await payload.update({
        collection: 'products',
        id: adjustment.product,
        data: { stock: adjustment.newStock },
        overrideAccess: false,
        req: transactionReq,
        user,
      })
    }

    if (transactionID !== null) await payload.db.commitTransaction(transactionID)
    return Response.json({ success: true, alreadyApplied: false, adjustments })
  } catch (error) {
    if (transactionID !== null) {
      try {
        await payload.db.rollbackTransaction(transactionID)
      } catch {}
    }
    const message = error instanceof Error ? error.message : 'Konfirmasi pesanan gagal.'
    const status =
      message === 'UNAUTHORIZED' ? 401 : message.includes('tidak mencukupi') ? 409 : 500
    return Response.json(
      { error: status === 401 ? 'Silakan login sebagai admin.' : message },
      { status },
    )
  }
}
