import { rpc, uploadObject } from '@/lib/supabase/rest'

/** Hasil RPC checkout_pelanggan */
export type CheckoutResult = {
  berhasil: boolean
  id_pesanan: number
  id_pembayaran: number
  kode_pelacakan: string
  total_harga: number | string
  metode_pembayaran: string
  status_pesanan: string
  status_pembayaran: string
}

/** Hasil RPC pelanggan_lacak_pesanan */
export type OrderTracking = {
  id_pesanan: number
  tanggal_pesan: string
  total_harga: number | string
  status_pesanan: string
  metode_pembayaran: string | null
  status_pembayaran: string | null
  bukti_tersedia: boolean
}

export type CheckoutInput = {
  nama: string
  email: string
  noHp: string
  alamat: string
  metode: 'Transfer' | 'Tunai' | 'QRIS'
  items: { id_produk: number; jumlah: number }[]
}

export const PROOF_BUCKET = 'bukti-pembayaran'
export const MAX_PROOF_BYTES = 10 * 1024 * 1024 // sama dengan batas bucket (10 MB)

export const formatOrderNumber = (id: number) => `GG-${String(id).padStart(4, '0')}`

export const errorMessage = (error: unknown) =>
  error instanceof Error && error.message ? error.message : 'Terjadi kesalahan. Coba lagi.'

/** Mengganti "produk ID 66003" pada pesan error database dengan nama produk. */
export function friendlyDbError(message: string, nameById: Record<string, string> = {}) {
  return message.replace(/([Pp])roduk ID (\d+)/g, (match, first: string, id: string) =>
    nameById[id] ? `${first}roduk ${nameById[id]}` : match,
  )
}

/* ---------- Kode pelacakan yang disimpan di browser pelanggan ---------- */

const TRACK_KEY = 'getuk-order-tracking'
export type TrackedOrder = { kode: string; savedAt: string }

export function readTrackedOrders(): TrackedOrder[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(TRACK_KEY) || '[]')
    return Array.isArray(parsed)
      ? parsed.filter((item): item is TrackedOrder => typeof item?.kode === 'string')
      : []
  } catch {
    return []
  }
}

export function saveTrackedOrder(kode: string) {
  const current = readTrackedOrders().filter((item) => item.kode !== kode)
  try {
    localStorage.setItem(
      TRACK_KEY,
      JSON.stringify([{ kode, savedAt: new Date().toISOString() }, ...current]),
    )
  } catch {}
}

export function removeTrackedOrder(kode: string) {
  try {
    localStorage.setItem(
      TRACK_KEY,
      JSON.stringify(readTrackedOrders().filter((item) => item.kode !== kode)),
    )
  } catch {}
}

/* ---------- Pemanggilan RPC / storage Supabase ---------- */

/** MENULIS ke database: membuat pelanggan, pesanan, detail, pembayaran, dan mengurangi stok. */
export async function createOrder(input: CheckoutInput): Promise<CheckoutResult> {
  return rpc<CheckoutResult>('checkout_pelanggan', {
    p_nama: input.nama,
    p_email: input.email,
    p_no_hp: input.noHp,
    p_alamat: input.alamat,
    p_metode: input.metode,
    p_items: input.items,
  })
}

/** Hanya membaca. */
export async function trackOrder(kode: string): Promise<OrderTracking> {
  return rpc<OrderTracking>('pelanggan_lacak_pesanan', { p_token: kode.trim() })
}

/** MENULIS: mengunggah file ke bucket bukti-pembayaran lalu memanggil pelanggan_kirim_bukti. */
export async function uploadPaymentProof(kode: string, file: File) {
  const ext =
    (file.name.split('.').pop() || 'jpg')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 5) || 'jpg'
  // Folder harus sama dengan kode pelacakan (disyaratkan kebijakan storage & RPC).
  const path = `${kode.trim()}/bukti-${Date.now()}.${ext}`

  await uploadObject(PROOF_BUCKET, path, file)
  await rpc('pelanggan_kirim_bukti', { p_token: kode.trim(), p_file_path: path })
}
