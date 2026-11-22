/**
 * Akses Supabase lewat REST API (fetch biasa), tanpa package tambahan.
 * Memakai kunci publik (publishable key). Hak akses dibatasi oleh RLS dan fungsi RPC di database.
 * Jangan pernah memasukkan kunci service_role ke kode website.
 */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  )
}

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) {
    throw new Error(
      'Konfigurasi Supabase belum diisi (NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).',
    )
  }
  return { url: url.replace(/\/+$/, ''), key }
}

function authHeaders(key: string): Record<string, string> {
  const headers: Record<string, string> = { apikey: key }
  // Kunci anon lama berbentuk JWT (eyJ...) juga harus dikirim sebagai Authorization.
  if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`
  return headers
}

async function readError(response: Response): Promise<string> {
  try {
    const body = await response.json()
    return body?.message || body?.error || body?.hint || `Permintaan gagal (${response.status})`
  } catch {
    return `Permintaan gagal (${response.status})`
  }
}

/** Memanggil fungsi RPC di Supabase. */
export async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const { url, key } = config()
  const response = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { ...authHeaders(key), 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(await readError(response))
  return (await response.json()) as T
}

/** Membaca baris tabel (hanya membaca). `query` berformat PostgREST, mis. "select=a,b&order=a.asc". */
export async function selectRows<T>(table: string, query: string): Promise<T[]> {
  const { url, key } = config()
  const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: authHeaders(key),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(await readError(response))
  return (await response.json()) as T[]
}

/** Mengunggah satu file ke bucket Storage (menulis ke Storage). */
export async function uploadObject(bucket: string, path: string, file: File): Promise<void> {
  const { url, key } = config()
  const encodedPath = path.split('/').map(encodeURIComponent).join('/')
  const body = new FormData()
  body.append('cacheControl', '3600')
  body.append('', file)
  const response = await fetch(`${url}/storage/v1/object/${bucket}/${encodedPath}`, {
    method: 'POST',
    headers: { ...authHeaders(key), 'x-upsert': 'false' },
    body,
  })
  if (!response.ok) throw new Error(await readError(response))
}
