import type { StoreProduct } from './product-catalog'

export type CartItem = StoreProduct & { quantity: number }

// Kunci yang sama dengan yang dipakai AppExperience, sehingga keranjang tetap kompatibel.
const CART_KEY = 'getuk-cart'

export function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

export function writeCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch {}
}

export function cartQuantity(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

/**
 * Mencocokkan isi keranjang dengan produk terbaru dari Supabase (berdasarkan slug).
 * Keranjang lama bisa berisi ID produk dari Payload; di sini ID, harga, dan stok
 * diganti dengan data Supabase. Produk yang tidak ada atau habis dikeluarkan.
 */
export function syncCartWithProducts(items: CartItem[], products: StoreProduct[]): CartItem[] {
  const bySlug = new Map(products.map((product) => [product.slug, product]))
  const next: CartItem[] = []
  for (const item of items) {
    const product = bySlug.get(item.slug)
    if (!product || product.stock <= 0) continue
    next.push({
      ...product,
      quantity: Math.max(1, Math.min(product.stock, Math.floor(item.quantity) || 1)),
    })
  }
  return next
}
