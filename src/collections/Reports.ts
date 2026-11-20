import type { CollectionConfig } from 'payload'

const ownerRead = ({ req }: any) =>
  req.user?.collection === 'app-users' && ['owner', 'admin'].includes(req.user.role)

export const Reports: CollectionConfig = {
  slug: 'reports',
  admin: { group: 'Laporan', useAsTitle: 'period' },
  access: { create: () => false, read: ownerRead, update: () => false, delete: () => false },
  fields: [
    { name: 'owner', type: 'relationship', relationTo: 'app-users', required: true },
    { name: 'order', type: 'relationship', relationTo: 'orders' },
    { name: 'createdAtReport', type: 'date', required: true },
    { name: 'period', type: 'text', required: true },
    { name: 'type', type: 'select', options: ['penjualan', 'produk', 'pesanan'], required: true },
  ],
}
