import type { CollectionConfig } from 'payload'

const staffOnly = ({ req }: any) =>
  req.user?.collection === 'admins' || req.user?.collection === 'app-users'

export const OrderItems: CollectionConfig = {
  slug: 'order-items',
  admin: { group: 'Operasional', useAsTitle: 'id' },
  access: { create: () => false, read: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'order', type: 'relationship', relationTo: 'orders', required: true },
    { name: 'product', type: 'relationship', relationTo: 'products', required: true },
    { name: 'quantity', type: 'number', required: true, min: 1 },
    { name: 'unitPrice', type: 'number', required: true, min: 0 },
    { name: 'subtotal', type: 'number', required: true, min: 0 },
  ],
}
