import type { CollectionConfig } from 'payload'

const staffOnly = ({ req }: any) => req.user?.collection === 'app-users'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: { group: 'Operasional', useAsTitle: 'name' },
  access: { create: () => false, read: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'address', type: 'textarea', required: true },
  ],
}
