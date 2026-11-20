import type { Access, CollectionConfig } from 'payload'

const canManageProducts: Access = ({ req }) =>
  req.user?.collection === 'admins' ||
  (req.user?.collection === 'app-users' && req.user.role === 'admin')

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    group: 'Toko',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'stock'],
  },
  access: {
    create: canManageProducts,
    delete: canManageProducts,
    read: () => true,
    update: canManageProducts,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Getuk', value: 'getuk' },
        { label: 'Jajanan Tradisional', value: 'jajanan' },
      ],
    },
    { name: 'price', type: 'number', required: true, min: 0 },
    { name: 'description', type: 'textarea', required: true },
    { name: 'stock', type: 'number', required: true, min: 0, defaultValue: 0 },
    { name: 'size', type: 'text' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
}
