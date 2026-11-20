import type { CollectionConfig } from 'payload'

const isSelfOrStaff = ({ req }: any) => {
  if (req.user?.collection !== 'app-users') return false
  if (req.user.role === 'admin') return true
  return { id: { equals: req.user.id } }
}

export const AppUsers: CollectionConfig = {
  slug: 'app-users',
  auth: true,
  admin: { group: 'Akses', useAsTitle: 'name' },
  access: {
    create: () => false,
    read: isSelfOrStaff,
    update: isSelfOrStaff,
    delete: ({ req }) => req.user?.collection === 'app-users' && req.user.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Pemilik', value: 'owner' },
      ],
    },
    { name: 'status', type: 'select', defaultValue: 'aktif', options: ['aktif', 'nonaktif'] },
  ],
}
