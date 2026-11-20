import type { Access, CollectionConfig } from 'payload'

const canManageStock: Access = ({ req }) =>
  req.user?.collection === 'admins' ||
  (req.user?.collection === 'app-users' && req.user.role === 'admin')

export const StockMovements: CollectionConfig = {
  slug: 'stock-movements',
  admin: {
    group: 'Operasional',
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'appliedAt'],
  },
  access: {
    create: canManageStock,
    delete: () => false,
    read: canManageStock,
    update: () => false,
  },
  fields: [
    { name: 'orderNumber', type: 'text', required: true, unique: true, index: true },
    { name: 'appliedAt', type: 'date', required: true },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        { name: 'quantity', type: 'number', required: true, min: 1 },
        { name: 'previousStock', type: 'number', required: true, min: 0 },
        { name: 'newStock', type: 'number', required: true, min: 0 },
      ],
    },
  ],
}
