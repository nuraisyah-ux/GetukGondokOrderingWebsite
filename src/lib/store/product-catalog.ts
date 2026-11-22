/**
 * Pemetaan data tabel `produk` (Supabase) ke bentuk Product yang dipakai tampilan website.
 *
 * Tabel `produk` hanya punya: id_produk, nama_produk, harga, deskripsi, stok.
 * Slug, kategori, dan nama tampilan dipetakan di sini (berdasarkan id_produk) supaya
 * tampilan Figma Make tidak berubah dan struktur database tidak perlu diubah.
 *
 * Produk baru yang belum terdaftar di sini tetap tampil: namanya memakai nama di database,
 * slug dibuat otomatis, dan kategorinya "jajanan".
 */

export type StoreProduct = {
  id: string
  name: string
  slug: string
  category: 'getuk' | 'jajanan'
  price: number
  description: string
  stock: number
  size?: string
  featured?: boolean
  image: string | null
}

export type ProdukRow = {
  id_produk: number
  nama_produk: string
  harga: number | string
  deskripsi: string | null
  stok: number
}

export const PRODUK_COLUMNS = 'id_produk, nama_produk, harga, deskripsi, stok'

type CatalogMeta = { name: string; slug: string; category: 'getuk' | 'jajanan' }

// Ubah nama tampilan di bawah ini bila berbeda dari yang Anda inginkan.
const CATALOG: Record<number, CatalogMeta> = {
  66001: { name: 'Getuk Gondok S', slug: 'getuk-gondok-s', category: 'getuk' },
  66002: { name: 'Getuk Gondok M', slug: 'getuk-gondok-m', category: 'getuk' },
  66003: { name: 'Getuk Gondok L', slug: 'getuk-gondok-l', category: 'getuk' },
  66004: { name: 'Getuk Gondok XL', slug: 'getuk-gondok-xl', category: 'getuk' },
  66005: { name: 'Klepon', slug: 'klepon', category: 'jajanan' },
  66006: { name: 'Jongkong', slug: 'jongkong', category: 'jajanan' },
  66007: { name: 'Yangko Ndeso', slug: 'yangko-ndeso', category: 'jajanan' },
  66008: { name: 'Wingko', slug: 'wingko', category: 'jajanan' },
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/\(.*?\)/g, ' ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'produk'
  )
}

export function mapProdukRow(row: ProdukRow): StoreProduct {
  const meta = CATALOG[row.id_produk]
  return {
    id: String(row.id_produk),
    name: meta?.name ?? row.nama_produk,
    slug: meta?.slug ?? `${slugify(row.nama_produk)}-${row.id_produk}`,
    category: meta?.category ?? 'jajanan',
    price: Number(row.harga),
    description: row.deskripsi ?? '',
    stock: Number(row.stok),
    featured: false,
    image: null,
  }
}
