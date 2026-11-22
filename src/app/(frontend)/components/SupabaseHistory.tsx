'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { StoreHeader, StoreIcon, money } from './StoreShell'
import { cartQuantity, readCart } from '@/lib/store/cart'
import {
  MAX_PROOF_BYTES,
  errorMessage,
  formatOrderNumber,
  readTrackedOrders,
  removeTrackedOrder,
  saveTrackedOrder,
  trackOrder,
  uploadPaymentProof,
  type OrderTracking,
} from '@/lib/store/orders'
import { isSupabaseConfigured } from '@/lib/supabase/rest'

type Entry = { kode: string; data?: OrderTracking; error?: string }

async function loadEntries(): Promise<Entry[]> {
  const tracked = readTrackedOrders()
  const entries = await Promise.all(
    tracked.map(async (item): Promise<Entry> => {
      try {
        return { kode: item.kode, data: await trackOrder(item.kode) }
      } catch (error) {
        return { kode: item.kode, error: errorMessage(error) }
      }
    }),
  )
  const time = (entry: Entry) => (entry.data ? new Date(entry.data.tanggal_pesan).getTime() : 0)
  return entries.sort((a, b) => time(b) - time(a))
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

export default function SupabaseHistory() {
  const configured = isSupabaseConfigured()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [lookupBusy, setLookupBusy] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)
  const [files, setFiles] = useState<Record<string, File | null>>({})
  const [uploadBusy, setUploadBusy] = useState<string | null>(null)
  const [uploadMessage, setUploadMessage] = useState<{ kode: string; text: string; ok: boolean } | null>(
    null,
  )

  useEffect(() => {
    setCount(cartQuantity(readCart()))
    if (!configured) {
      setLoading(false)
      return
    }
    loadEntries()
      .then(setEntries)
      .finally(() => setLoading(false))
  }, [configured])

  async function handleLookup(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const kode = code.trim()
    if (!kode || lookupBusy) return
    setLookupBusy(true)
    setLookupError(null)
    try {
      await trackOrder(kode)
      saveTrackedOrder(kode)
      setEntries(await loadEntries())
      setSelected(kode)
      setCode('')
    } catch (error) {
      setLookupError(errorMessage(error))
    } finally {
      setLookupBusy(false)
    }
  }

  async function handleUpload(kode: string) {
    const file = files[kode]
    if (!file || uploadBusy) return
    if (!file.type.startsWith('image/'))
      return setUploadMessage({ kode, text: 'Bukti pembayaran harus berupa foto.', ok: false })
    if (file.size > MAX_PROOF_BYTES)
      return setUploadMessage({ kode, text: 'Ukuran foto bukti maksimal 10 MB.', ok: false })
    setUploadBusy(kode)
    setUploadMessage(null)
    try {
      await uploadPaymentProof(kode, file)
      setFiles((current) => ({ ...current, [kode]: null }))
      setEntries(await loadEntries())
      setUploadMessage({ kode, text: 'Bukti pembayaran berhasil dikirim.', ok: true })
    } catch (error) {
      setUploadMessage({ kode, text: errorMessage(error), ok: false })
    } finally {
      setUploadBusy(null)
    }
  }

  return (
    <>
      <StoreHeader cartCount={count} />
      <main className="mx-auto max-w-[1000px] px-5 py-14">
        <p className="eyebrow">Pesanan Anda</p>
        <h1 className="page-title">Riwayat pesanan</h1>

        <form
          onSubmit={handleLookup}
          className="mt-10 grid gap-3 rounded-2xl border border-[#e4dccf] bg-white p-3 md:grid-cols-[1fr_auto]"
        >
          <label className="flex items-center gap-3 rounded-xl bg-[#f6f3ec] px-4">
            <StoreIcon name="search" />
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="h-12 w-full border-0 bg-transparent p-0 outline-none"
              placeholder="Lacak dengan kode pelacakan..."
              aria-label="Kode pelacakan"
            />
          </label>
          <button
            disabled={!code.trim() || lookupBusy || !configured}
            className="h-12 rounded-full bg-[#265c47] px-6 font-bold text-white disabled:bg-[#aaa]"
          >
            {lookupBusy ? 'Mencari...' : 'Lacak Pesanan'}
          </button>
        </form>
        {lookupError && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {lookupError}
          </p>
        )}
        {!configured && (
          <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            Koneksi database belum dikonfigurasi.
          </p>
        )}

        <div className="mt-8 space-y-4">
          {loading && <p className="text-sm font-semibold text-[#72766f]">Memuat pesanan...</p>}

          {!loading && configured && entries.length === 0 && (
            <div className="rounded-[28px] border border-dashed border-[#d8cdbc] bg-white p-16 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#edf3ea] text-[#265c47]">
                <StoreIcon name="cart" size={28} />
              </span>
              <h2 className="mt-5 font-serif text-2xl font-bold">Belum ada pesanan</h2>
              <p className="mt-2 text-[#73766f]">
                Pesanan yang dibuat di perangkat ini akan tampil di sini.
              </p>
              <Link
                href="/produk"
                className="mt-7 inline-flex rounded-full bg-[#265c47] px-6 py-3 font-bold text-white"
              >
                Lihat Produk
              </Link>
            </div>
          )}

          {entries.map((entry) => {
            const o = entry.data
            if (!o)
              return (
                <div
                  key={entry.kode}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e4dccf] bg-white p-5"
                >
                  <div className="min-w-0">
                    <span className="text-xs text-[#7d807a]">Kode pelacakan</span>
                    <b className="mt-1 block break-all text-sm text-[#173d30]">{entry.kode}</b>
                    <span className="mt-1 block text-sm font-semibold text-red-700">
                      {entry.error}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      removeTrackedOrder(entry.kode)
                      setEntries((current) => current.filter((item) => item.kode !== entry.kode))
                    }}
                    className="rounded-full border border-[#d7cebf] px-5 py-2 text-sm font-bold text-[#59625c]"
                  >
                    Hapus
                  </button>
                </div>
              )

            const canUpload =
              o.status_pembayaran === 'Belum lunas' &&
              !o.bukti_tersedia &&
              o.status_pesanan !== 'Dibatalkan' &&
              ['Transfer', 'QRIS'].includes(o.metode_pembayaran ?? '')

            return (
              <div
                key={entry.kode}
                className="grid gap-5 rounded-2xl border border-[#e4dccf] bg-white p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
              >
                <div>
                  <span className="text-xs text-[#7d807a]">Nomor pesanan</span>
                  <b className="mt-1 block text-[#173d30]">{formatOrderNumber(o.id_pesanan)}</b>
                  <span className="mt-2 block text-sm text-[#7d807a]">
                    {formatDate(o.tanggal_pesan)}
                  </span>
                </div>
                <div>
                  <b className="block">{money(Number(o.total_harga))}</b>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="status">{o.status_pesanan}</span>
                    <span className="status">{o.status_pembayaran ?? '-'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(selected === entry.kode ? null : entry.kode)}
                  className="rounded-full border border-[#265c47] px-5 py-2 text-sm font-bold text-[#265c47]"
                >
                  {selected === entry.kode ? 'Tutup Detail' : 'Lihat Detail'}
                </button>
                {selected === entry.kode && (
                  <div className="rounded-xl bg-[#f6f3ec] p-4 text-sm leading-6 text-[#59625c] sm:col-span-3">
                    Status terakhir: <b>{o.status_pesanan}</b>. Metode pembayaran:{' '}
                    <b>{o.metode_pembayaran ?? '-'}</b>. Pembayaran: <b>{o.status_pembayaran ?? '-'}</b>
                    {['Transfer', 'QRIS'].includes(o.metode_pembayaran ?? '') && (
                      <>
                        . Bukti pembayaran: <b>{o.bukti_tersedia ? 'Sudah dikirim' : 'Belum dikirim'}</b>
                      </>
                    )}
                    .
                    <span className="mt-2 block break-all text-xs text-[#7d807a]">
                      Kode pelacakan: {entry.kode}
                    </span>
                    {canUpload && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                        <label>
                          Unggah bukti pembayaran
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              setFiles((current) => ({
                                ...current,
                                [entry.kode]: event.target.files?.[0] ?? null,
                              }))
                            }
                          />
                        </label>
                        <button
                          onClick={() => handleUpload(entry.kode)}
                          disabled={!files[entry.kode] || uploadBusy === entry.kode}
                          className="h-12 rounded-full bg-[#265c47] px-6 font-bold text-white disabled:bg-[#aaa]"
                        >
                          {uploadBusy === entry.kode ? 'Mengirim...' : 'Kirim Bukti'}
                        </button>
                      </div>
                    )}
                    {uploadMessage?.kode === entry.kode && (
                      <p
                        className={`mt-3 text-sm font-bold ${uploadMessage.ok ? 'text-[#4d8067]' : 'text-red-700'}`}
                      >
                        {uploadMessage.text}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
