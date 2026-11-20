import type { CollectionConfig } from 'payload'

const staffOnly = ({ req }: any) =>
  req.user?.collection === 'admins' || req.user?.collection === 'app-users'

export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: { group: 'Operasional', useAsTitle: 'id' },
  access: { create: () => false, read: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'order', type: 'relationship', relationTo: 'orders', required: true, unique: true },
    { name: 'amount', type: 'number', required: true, min: 0 },
    {
      name: 'method',
      type: 'select',
      required: true,
      options: [
        { label: 'Transfer Bank', value: 'bank' },
        { label: 'QRIS / E-wallet', value: 'qris' },
        { label: 'Tunai', value: 'cash' },
      ],
    },
    { name: 'paidAt', type: 'date' },
    { name: 'proof', type: 'upload', relationTo: 'media' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'menunggu',
      options: [
        { label: 'Menunggu', value: 'menunggu' },
        { label: 'Terverifikasi', value: 'terverifikasi' },
        { label: 'Ditolak', value: 'ditolak' },
      ],
    },
  ],
}
