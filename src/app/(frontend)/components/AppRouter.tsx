'use client'

import { usePathname } from 'next/navigation'
import AppExperience from './AppExperience'
import SupabaseCheckout from './SupabaseCheckout'
import SupabaseHistory from './SupabaseHistory'

// Pembungkus tipis: hanya /checkout dan /riwayat-pesanan yang memakai komponen baru
// (terhubung Supabase). Halaman lain tetap memakai AppExperience tanpa perubahan.
export default function AppRouter() {
  const path = usePathname()
  if (path === '/checkout') return <SupabaseCheckout />
  if (path === '/riwayat-pesanan') return <SupabaseHistory />
  return <AppExperience />
}
