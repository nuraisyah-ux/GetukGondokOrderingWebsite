'use client'

// Salinan Icon + Header dari AppExperience.tsx (tampilan identik) agar halaman Checkout
// dan Riwayat yang baru bisa dibuat tanpa mengubah file AppExperience.tsx yang besar.
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export const money = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

export function StoreIcon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    cart: (
      <>
        <circle cx="9" cy="20" r="1" />
        <circle cx="19" cy="20" r="1" />
        <path d="M3 4h2l2.6 10.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    down: <path d="m8 10 4 4 4-4" />,
    shop: (
      <>
        <path d="M4 10v10h16V10M3 10l2-6h14l2 6" />
        <path d="M8 20v-6h8v6" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  )
}

export function StoreHeader({ cartCount }: { cartCount: number }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const navItems = [
    { href: '/', label: 'Beranda', active: pathname === '/' },
    { href: '/produk', label: 'Produk', active: pathname.startsWith('/produk') },
    { href: '/#tentang', label: 'Tentang Kami', active: false },
    { href: '/#kontak', label: 'Kontak', active: false },
  ]
  return (
    <header className="sticky top-0 z-50 border-b border-[#ddcfbd] bg-[#fffaf1]/95 backdrop-blur">
      <div className="mx-auto flex h-[84px] max-w-[1400px] items-center justify-between px-5 lg:h-[94px] lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#173d30] text-[#f4d58d] shadow-sm lg:h-14 lg:w-14">
            <StoreIcon name="shop" size={26} />
          </span>
          <span>
            <b className="block font-serif text-xl leading-none text-[#173d30] lg:text-2xl">
              Getuk Gondok
            </b>
            <small className="mt-1 block text-[10px] font-bold tracking-[.18em] text-[#a55335] lg:text-[11px]">
              HJ. SRI RAHAYU · MAGELANG
            </small>
          </span>
        </Link>
        <nav className="hidden items-center gap-2 text-sm font-bold text-[#4d514b] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-1 rounded-full px-5 py-3 ${
                item.active
                  ? 'bg-[#265c47] text-white shadow-md shadow-[#265c47]/15'
                  : 'hover:bg-[#efe8da] hover:text-[#173d30]'
              }`}
            >
              {item.label}
              {item.label === 'Produk' && <StoreIcon name="down" size={16} />}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-[#244b3d]">
          <Link
            href="/keranjang"
            className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-[#efe8da]"
            aria-label="Keranjang"
          >
            <StoreIcon name="cart" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#c95d3b] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <span className="mx-1 hidden h-8 w-px bg-[#cdbda6] sm:block" />
          <Link
            href="/produk"
            className="hidden h-11 w-11 place-items-center rounded-full hover:bg-[#efe8da] sm:grid"
            aria-label="Cari produk"
          >
            <StoreIcon name="search" size={23} />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#ded5c5] lg:hidden"
            aria-label="Menu"
          >
            <StoreIcon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-[#eee5d8] bg-[#fffdf8] p-4 lg:hidden">
          {navItems.map((item) => (
            <Link key={item.label} className="rounded-xl p-3 font-semibold" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
