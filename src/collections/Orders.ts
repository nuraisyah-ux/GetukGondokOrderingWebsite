import type { CollectionConfig } from 'payload'

const staffOnly = ({ req }: any) =>
  req.user?.collection === 'admins' || req.user?.collection === 'app-users'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    group: 'Operasional',
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'orderDate', 'total', 'status'],
  },
  access: { create: () => false, read: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'orderNumber', type: 'text', required: true, unique: true, index: true },
    { name: 'customer', type: 'relationship', relationTo: 'customers', required: true },
    { name: 'handledBy', type: 'relationship', relationTo: 'app-users' },
    { name: 'orderDate', type: 'date', required: true },
    { name: 'total', type: 'number', required: true, min: 0 },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'menunggu-konfirmasi',
      options: [
        { label: 'Menunggu Konfirmasi', value: 'menunggu-konfirmasi' },
        { label: 'Diproses', value: 'diproses' },
        { label: 'Selesai', value: 'selesai' },
        { label: 'Dibatalkan', value: 'dibatalkan' },
      ],
    },
  ],
}
