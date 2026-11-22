'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { StoreHeader, StoreIcon, money } from './StoreShell'
import { readCart, syncCartWithProducts, writeCart, type CartItem } from '@/lib/store/cart'
import type { StoreProduct } from '@/lib/store/product-catalog'
import {
  MAX_PROOF_BYTES,
  createOrder,
  errorMessage,
  formatOrderNumber,
  friendlyDbError,
  saveTrackedOrder,
  uploadPaymentProof,
} from '@/lib/store/orders'
import { isSupabaseConfigured } from '@/lib/supabase/rest'

type Method = 'bank' | 'qris' | 'cash'
const METHOD_DB = { bank: 'Transfer', qris: 'QRIS', cash: 'Tunai' } as const

type Done = {
  orderNumber: string
  kode: string
  orderStatus: string
  paymentStatus: string
  proofWarning: string | null
}

// Rekening & WhatsApp dibaca dari Pengaturan Website (masih tersimpan di browser, bukan database).
function useStoreContact() {
  const [contact, setContact] = useState({
    bankAccount: 'BCA 1234567890 a.n. Sri Rahayu',
    whatsapp: '0856-4373-0540',
  })
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('getuk-site-settings') || 'null')
      if (saved) {
        setContact((current) => ({
          bankAccount: saved.bankAccount || current.bankAccount,
          whatsapp: saved.whatsapp || current.whatsapp,
        }))
      }
    } catch {}
  }, [])
  return contact
}

export default function SupabaseCheckout() {
  const router = useRouter()
  const settings = useStoreContact()
  const configured = isSupabaseConfigured()
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [method, setMethod] = useState<Method>('bank')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<Done | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    const stored = readCart()
    setItems(stored)
    fetch('/store-api/products')
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return
        const products: StoreProduct[] = data.products || []
        if (!products.length) return
        const synced = syncCartWithProducts(stored, products)
        const signature = (list: CartItem[]) =>
          JSON.stringify(list.map((item) => [item.id, item.quantity, item.price]))
        if (signature(synced) !== signature(stored)) {
          setNotice('Isi keranjang disesuaikan dengan harga dan stok terbaru.')
          writeCart(synced)
          setItems(synced)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !items.length) return
    const formData = new FormData(event.currentTarget)
    const fileValue = formData.get('proof')
    const proof = fileValue instanceof File && fileValue.size > 0 ? fileValue : null

    if (method !== 'cash') {
      if (!proof) return setError('Unggah bukti pembayaran terlebih dahulu.')
      if (!proof.type.startsWith('image/')) return setError('Bukti pembayaran harus berupa foto.')
      if (proof.size > MAX_PROOF_BYTES) return setError('Ukuran foto bukti maksimal 10 MB.')
    }

    setBusy(true)
    setError(null)
    const nameById = Object.fromEntries(items.map((item) => [item.id, item.name]))
    try {
      const result = await createOrder({
        nama: String(formData.get('customerName') || ''),
        email: String(formData.get('email') || ''),
        noHp: String(formData.get('phone') || ''),
        alamat: String(formData.get('address') || ''),
        metode: METHOD_DB[method],
        items: items.map((item) => ({ id_produk: Number(item.id), jumlah: item.quantity })),
      })

      saveTrackedOrder(result.kode_pelacakan)
      writeCart([])
      setItems([])

      let proofWarning: string | null = null
      if (proof) {
        try {
          await uploadPaymentProof(result.kode_pelacakan, proof)
        } catch (uploadError) {
          proofWarning = `Pesanan sudah tersimpan, tetapi bukti pembayaran belum terkirim (${errorMessage(uploadError)}). Buka Riwayat Pesanan untuk mengunggah ulang.`
        }
      }

      setDone({
        orderNumber: formatOrderNumber(result.id_pesanan),
        kode: result.kode_pelacakan,
        orderStatus: result.status_pesanan,
        paymentStatus: result.status_pembayaran,
        proofWarning,
      })
    } catch (submitError) {
      setError(friendlyDbError(errorMessage(submitError), nameById))
    } finally {
      setBusy(false)
    }
  }

  if (done)
    return (
      <>
        <StoreHeader cartCount={0} />
        <main className="mx-auto max-w-xl px-5 py-28 text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#dcebdd] text-[#265c47]">
            <StoreIcon name="check" size={36} />
          </span>
          <p className="eyebrow mt-7">Pesanan berhasil dibuat</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-[#173d30]">Terima kasih!</h1>
          <p className="mt-4 text-[#6f736d]">Nomor pesanan Anda</p>
          <div className="mt-4 rounded-2xl bg-white p-5 text-2xl font-bold tracking-wider text-[#bd4d2f]">
            {done.orderNumber}
          </div>
          <p className="mt-5 rounded-full bg-[#fbefdf] px-4 py-2 text-sm font-bold text-[#9b5c37]">
            {done.orderStatus} · {done.paymentStatus}
          </p>
          <div className="mt-6 rounded-2xl border border-[#e4dccf] bg-white p-5 text-left">
            <span className="text-xs font-bold uppercase tracking-[.14em] text-[#a55335]">
              Kode pelacakan
            </span>
            <b className="mt-2 block break-all text-sm text-[#173d30]">{done.kode}</b>
            <p className="mt-2 text-xs leading-5 text-[#7a7d76]">
              Simpan kode ini untuk melacak pesanan dari perangkat lain. Kode hanya ditampilkan satu
              kali.
            </p>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(done.kode)
                  setCopied(true)
                } catch {}
              }}
              className="mt-3 rounded-full border border-[#265c47] px-4 py-2 text-xs font-bold text-[#265c47]"
            >
              {copied ? 'Kode tersalin' : 'Salin kode'}
            </button>
          </div>
          {done.proofWarning && (
            <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-bold text-red-700">
              {done.proofWarning}
            </p>
          )}
          <button
            onClick={() => router.push('/riwayat-pesanan')}
            className="mt-8 rounded-full bg-[#265c47] px-7 py-4 font-bold text-white"
          >
            Lihat Riwayat Pesanan
          </button>
        </main>
      </>
    )

  return (
    <>
      <StoreHeader cartCount={items.length} />
      <main className="mx-auto max-w-[1120px] px-5 py-14 lg:px-8">
        <p className="eyebrow">Satu langkah lagi</p>
        <h1 className="page-title">Checkout</h1>
        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]"
        >
          <div className="space-y-6">
            <section className="form-card">
              <div className="step">1</div>
              <div>
                <h2 className="form-title">Data pelanggan</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label>
                    Nama lengkap
                    <input required name="customerName" placeholder="Nama Anda" />
                  </label>
                  <label>
                    Email
                    <input required name="email" type="email" placeholder="nama@email.com" />
                  </label>
                  <label>
                    Nomor HP
                    <input required name="phone" placeholder="08xxxxxxxxxx" />
                  </label>
                  <label className="sm:col-span-2">
                    Alamat lengkap
                    <textarea
                      required
                      name="address"
                      rows={3}
                      placeholder="Jalan, kelurahan, kecamatan, kota"
                    />
                  </label>
                </div>
              </div>
            </section>
            <section className="form-card">
              <div className="step">2</div>
              <div>
                <h2 className="form-title">Metode pembayaran</h2>
                <div className="mt-5 grid gap-3">
                  {(
                    [
                      ['bank', 'Transfer Bank'],
                      ['qris', 'QRIS / E-wallet'],
                      ['cash', 'Tunai'],
                    ] as [Method, string][]
                  ).map(([v, l]) => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => setMethod(v)}
                      className={`flex items-center justify-between rounded-xl border p-4 text-left font-bold ${method === v ? 'border-[#265c47] bg-[#edf3ea]' : 'border-[#e1d9cc]'}`}
                    >
                      <span>{l}</span>
                      <span
                        className={`h-4 w-4 rounded-full border-4 ${method === v ? 'border-[#265c47]' : 'border-[#ccc]'}`}
                      />
                    </button>
                  ))}
                </div>
                {method === 'bank' && (
                  <div className="payment-note">
                    <b>{settings.bankAccount}</b>
                    <label className="mt-4">
                      Unggah bukti pembayaran
                      <input required type="file" name="proof" accept="image/*" />
                    </label>
                  </div>
                )}
                {method === 'qris' && (
                  <div className="payment-note">
                    <div className="grid h-36 place-items-center rounded-xl bg-white text-sm font-bold text-[#557064]">
                      Gambar QRIS Toko
                    </div>
                    <label className="mt-4">
                      Unggah bukti pembayaran
                      <input required type="file" name="proof" accept="image/*" />
                    </label>
                  </div>
                )}
                {method === 'cash' && (
                  <div className="payment-note">
                    Nomor pesanan akan dikirim ke WhatsApp untuk konfirmasi. Pesanan tunai diproses
                    setelah dikonfirmasi melalui {settings.whatsapp}.
                  </div>
                )}
              </div>
            </section>
          </div>
          <aside className="h-fit rounded-[24px] border border-[#e2dacc] bg-white p-6">
            <h2 className="font-serif text-2xl font-bold text-[#173d30]">Ringkasan pesanan</h2>
            <div className="mt-5 space-y-4">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between gap-4 text-sm">
                  <span>
                    {i.name} <b>×{i.quantity}</b>
                  </span>
                  <b>{money(i.price * i.quantity)}</b>
                </div>
              ))}
              {ready && items.length === 0 && (
                <p className="text-sm text-[#7a7d76]">
                  Keranjang masih kosong.{' '}
                  <Link href="/produk" className="font-bold text-[#265c47]">
                    Lihat produk
                  </Link>
                </p>
              )}
            </div>
            <div className="my-6 border-t border-[#e3dbce]" />
            <div className="flex items-end justify-between">
              <span>Total</span>
              <b className="text-2xl text-[#bd4d2f]">{money(total)}</b>
            </div>
            {notice && (
              <p className="mt-4 rounded-xl bg-[#fbefdf] px-4 py-3 text-xs font-bold text-[#9b5c37]">
                {notice}
              </p>
            )}
            {!configured && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                Koneksi database belum dikonfigurasi. Pesanan belum dapat dibuat.
              </p>
            )}
            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {error}
              </p>
            )}
            <button
              disabled={!items.length || busy || !configured}
              className="mt-7 h-13 w-full rounded-full bg-[#265c47] font-bold text-white disabled:bg-[#aaa]"
            >
              {busy ? 'Memproses pesanan...' : 'Buat Pesanan'}
            </button>
            <p className="mt-4 text-center text-xs leading-5 text-[#7a7d76]">
              Dengan melanjutkan, Anda menyetujui detail pesanan dan metode pembayaran.
            </p>
          </aside>
        </form>
      </main>
    </>
  )
}
