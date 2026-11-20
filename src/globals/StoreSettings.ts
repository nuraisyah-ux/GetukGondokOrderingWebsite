import type { GlobalConfig } from 'payload'

export const StoreSettings: GlobalConfig = {
  slug: 'store-settings',
  admin: { group: 'Toko' },
  access: { read: () => true },
  fields: [
    { name: 'heroTitle', type: 'text', defaultValue: 'Manisnya Tradisi Magelang' },
    {
      name: 'heroDescription',
      type: 'textarea',
      defaultValue: 'Getuk lembut, segar, dan dibuat setiap hari dari bahan pilihan.',
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'about', type: 'textarea' },
    { name: 'bankAccount', type: 'text', defaultValue: 'BCA 1234567890 a.n. Sri Rahayu' },
    { name: 'qrisImage', type: 'upload', relationTo: 'media' },
    { name: 'whatsapp', type: 'text', defaultValue: '6281234567890' },
    { name: 'featuredProducts', type: 'relationship', relationTo: 'products', hasMany: true },
  ],
}
