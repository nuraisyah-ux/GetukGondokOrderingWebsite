'use client'

import NextImage, { type ImageProps } from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

function Image(props: ImageProps) {
  // The Figma loader only resizes Payload media; app-owned and remote images must bypass it.
  return <NextImage {...props} unoptimized />
}

type Product = {
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

type CartItem = Product & { quantity: number }

type SiteSettings = {
  heroTitle: string
  heroOwner: string
  heroTagline: string
  heroDescription: string
  heroImage: string
  about: string
  address: string
  hours: string
  whatsapp: string
  instagram: string
  tiktok: string
  bankAccount: string
}

const defaultSiteSettings: SiteSettings = {
  heroTitle: 'Getuk Gondok',
  heroOwner: 'Hj. Sri Rahayu',
  heroTagline: 'Manisnya pas, lembutnya bikin nagih.',
  heroDescription:
    'Dibuat segar setiap pagi dari singkong pilihan dan resep keluarga yang telah dipercaya turun-temurun.',
  heroImage: '/hero-getuk-gondok.webp',
  about:
    'Berawal dari dapur kecil di Magelang, Hj. Sri Rahayu merawat rasa getuk yang sederhana namun berkesan. Singkong pilihan dikukus, diolah, dan dikemas pada hari yang sama agar lembut dan segar sampai ke tangan Anda.',
  address: 'Magelang, Jawa Tengah',
  hours: 'Setiap hari, 06.00–17.00 WIB',
  whatsapp: '0856-4373-0540',
  instagram: '@getukgondok',
  tiktok: 'getukgondok_magelang',
  bankAccount: 'BCA 1234567890 a.n. Sri Rahayu',
}

function useSiteSettings() {
  const [settings, setSettings] = useState(defaultSiteSettings)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('getuk-site-settings')
      if (saved) setSettings({ ...defaultSiteSettings, ...JSON.parse(saved) })
    } catch {}

    const sync = (event: Event) => {
      const next = (event as CustomEvent<SiteSettings>).detail
      if (next) setSettings(next)
    }
    window.addEventListener('getuk-site-settings', sync)
    return () => window.removeEventListener('getuk-site-settings', sync)
  }, [])

  const save = (next: SiteSettings) => {
    setSettings(next)
    localStorage.setItem('getuk-site-settings', JSON.stringify(next))
    window.dispatchEvent(new CustomEvent('getuk-site-settings', { detail: next }))
  }

  return [settings, save] as const
}

const catalogOrder = [
  'getuk-gondok-s',
  'getuk-gondok-m',
  'getuk-gondok-l',
  'getuk-gondok-xl',
  'getuk-gondok-mix',
  'klepon',
  'jongkong',
  'yangko-ndeso',
  'wingko',
]

const fallbackImage =
  'https://images.unsplash.com/photo-1659758058868-214380ccf253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=85&w=1200'

const productImage = (product: Pick<Product, 'slug' | 'image'>) =>
  catalogOrder.includes(product.slug)
    ? `/product-images/${product.slug}.webp`
    : product.image || fallbackImage

const money = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

function Icon({ name, size = 20 }: { name: string; size?: number }) {
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
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7" />
        <path d="M10 11v5m4-5v5" />
      </>
    ),
    box: (
      <>
        <path d="m4 7 8-4 8 4-8 4-8-4Z" />
        <path d="M4 7v10l8 4 8-4V7M12 11v10" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-4 2-6 6-6s6 2 6 6" />
        <path d="M16 5c2 .2 3 1.2 3 3s-1 2.8-3 3m1 3c3 .5 4 2.4 4 5" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10m6 10V4m6 16v-7m5 7H2" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    down: <path d="m8 10 4 4 4-4" />,
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.7 2.8 8.1 7 10 4.2-1.9 7-5.3 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 4C11 4 5 8 5 15c0 2 1 4 3 5 1-7 5-10 12-16Z" />
        <path d="M5 20c3-5 7-8 12-10" />
      </>
    ),
    heart: (
      <path d="M20.8 5.8a5.4 5.4 0 0 0-7.6 0L12 7l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 22l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z" />
    ),
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

function Header({ cartCount }: { cartCount: number }) {
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
            <Icon name="shop" size={26} />
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
              {item.label === 'Produk' && <Icon name="down" size={16} />}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-[#244b3d]">
          <Link
            href="/keranjang"
            className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-[#efe8da]"
            aria-label="Keranjang"
          >
            <Icon name="cart" />
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
            <Icon name="search" size={23} />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="grid h-11 w-11 place-items-center rounded-full border border-[#ded5c5] lg:hidden"
            aria-label="Menu"
          >
            <Icon name={open ? 'close' : 'menu'} />
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

function Footer() {
  const [settings] = useSiteSettings()
  const whatsappNumber = settings.whatsapp.replace(/\D/g, '').replace(/^0/, '62')
  return (
    <footer id="kontak" className="mt-20 bg-[#173d30] text-[#e9efe9]">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="font-serif text-2xl">
            {settings.heroTitle} {settings.heroOwner}
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-7 text-[#bdcec5]">
            {settings.heroDescription}
          </p>
        </div>
        <div>
          <h4 className="font-bold">Kunjungi Kami</h4>
          <p className="mt-3 text-sm leading-7 text-[#bdcec5]">
            {settings.address}
            <br />
            {settings.hours}
          </p>
        </div>
        <div>
          <h4 className="font-bold">Kontak & Media Sosial</h4>
          <div className="mt-3 grid gap-2 text-sm text-[#bdcec5]">
            <a
              href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
              target="_blank"
            >
              Instagram: <b className="text-white">{settings.instagram}</b>
            </a>
            <a href={`https://tiktok.com/@${settings.tiktok}`} target="_blank">
              TikTok: <b className="text-white">{settings.tiktok}</b>
            </a>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank">
              WhatsApp: <b className="text-white">{settings.whatsapp}</b>
            </a>
          </div>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Halo Getuk Gondok, saya ingin memesan produk.')}`}
            target="_blank"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#f4d58d] px-5 py-3 text-sm font-bold text-[#173d30]"
          >
            Hubungi WhatsApp <Icon name="arrow" size={17} />
          </a>
        </div>
      </div>
    </footer>
  )
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-[#e8e0d2] bg-white shadow-[0_12px_40px_rgba(60,43,24,.06)] transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(60,43,24,.12)]">
      <Link
        href={`/produk/${product.slug}`}
        className="relative block aspect-[3/2] overflow-hidden bg-[#efe9dc]"
      >
        <Image
          src={productImage(product)}
          alt={product.name}
          fill
          className="object-contain transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {product.stock <= 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-[#7e2d25] px-3 py-1.5 text-xs font-bold text-white">
            Stok Habis
          </span>
        )}
        {product.featured && product.stock > 0 && (
          <span className="absolute left-4 top-4 rounded-full bg-[#f4d58d] px-3 py-1.5 text-xs font-bold text-[#4c3b18]">
            Favorit
          </span>
        )}
      </Link>
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.13em] text-[#8c6b43]">
              {product.category === 'getuk' ? 'Getuk' : 'Jajanan Tradisional'}
            </p>
            <Link href={`/produk/${product.slug}`}>
              <h3 className="mt-1 font-serif text-xl font-bold text-[#173d30]">{product.name}</h3>
            </Link>
          </div>
          <button
            disabled={product.stock <= 0}
            onClick={() => onAdd(product)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#265c47] text-white transition hover:bg-[#173d30] disabled:bg-[#c9c9c3]"
            aria-label={`Tambah ${product.name}`}
          >
            <Icon name="plus" />
          </button>
        </div>
        <p className="line-clamp-2 min-h-12 text-sm leading-6 text-[#6e716b]">
          {product.description}
        </p>
        <div className="mt-4 flex items-end justify-between">
          <b className="text-lg text-[#bd4d2f]">{money(product.price)}</b>
          <span className="text-xs font-semibold text-[#64806f]">
            {product.stock > 0 ? `Stok ${product.stock}` : 'Tidak tersedia'}
          </span>
        </div>
      </div>
    </article>
  )
}

function Home({
  products,
  onAdd,
  count,
}: {
  products: Product[]
  onAdd: (p: Product) => void
  count: number
}) {
  const [settings] = useSiteSettings()
  const orderedProducts = [...products].sort(
    (a, b) => catalogOrder.indexOf(a.slug) - catalogOrder.indexOf(b.slug),
  )
  return (
    <>
      <Header cartCount={count} />
      <main>
        <section className="relative overflow-hidden bg-[#fbf2e3]">
          <div className="pointer-events-none absolute -left-20 top-20 h-56 w-56 rounded-full bg-[#f4d58d]/20 blur-3xl" />
          <div className="pointer-events-none absolute left-[43%] top-24 h-4 w-4 rotate-45 rounded-sm bg-[#bd4d2f]/40" />
          <div className="relative mx-auto grid max-w-[1400px] lg:min-h-[650px] lg:grid-cols-[.92fr_1.08fr]">
            <div className="relative z-20 flex flex-col justify-center px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
              <p className="font-serif text-xl italic text-[#8f5938] sm:text-2xl">
                Camilan Tradisional Khas Magelang
              </p>
              <div className="mt-5 h-px w-48 bg-gradient-to-r from-[#bd4d2f] to-transparent" />
              <h1 className="mt-7 font-serif leading-[.92] tracking-[-.045em]">
                <span className="block text-6xl text-[#173d30] sm:text-7xl lg:text-[92px]">
                  {settings.heroTitle}
                </span>
                <span className="mt-3 block text-5xl text-[#bd4d2f] sm:text-6xl lg:text-[72px]">
                  {settings.heroOwner}
                </span>
              </h1>
              <p className="mt-7 max-w-lg text-xl font-semibold italic text-[#5f4b3d] sm:text-2xl">
                {settings.heroTagline}
              </p>
              <p className="mt-4 max-w-lg text-base leading-7 text-[#71675e]">
                {settings.heroDescription}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="#produk-beranda"
                  className="inline-flex items-center gap-4 rounded-full bg-[#265c47] px-7 py-4 font-bold text-white shadow-xl shadow-[#265c47]/20 hover:-translate-y-0.5 hover:bg-[#173d30]"
                >
                  Lihat Produk
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f4d58d] text-[#173d30]">
                    <Icon name="arrow" size={17} />
                  </span>
                </Link>
                <span className="text-sm font-bold text-[#8b674c]">Dibuat segar setiap hari</span>
              </div>
            </div>
            <div className="relative z-10 min-h-[480px] overflow-hidden lg:min-h-[650px] lg:rounded-bl-[72px]">
              <Image
                src={settings.heroImage}
                alt="Aneka Getuk Gondok Hj. Sri Rahayu khas Magelang"
                fill
                priority
                className="object-cover object-bottom"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fbf2e3] via-transparent to-transparent lg:w-32" />
              <div className="absolute bottom-5 right-5 rounded-2xl border border-white/50 bg-white/90 px-5 py-4 shadow-xl backdrop-blur">
                <span className="block text-xs font-bold uppercase tracking-[.14em] text-[#a55335]">
                  Sejak 2004
                </span>
                <b className="mt-1 block font-serif text-lg text-[#173d30]">Resep asli keluarga</b>
              </div>
            </div>
          </div>
          <div className="relative z-30 bg-[#173d30] text-white">
            <div className="mx-auto grid max-w-[1400px] gap-0 px-5 sm:grid-cols-3 lg:grid-cols-[repeat(3,190px)_1fr] lg:px-12">
              {[
                ['shield', 'Rasa Lezat', 'Cita rasa autentik'],
                ['leaf', 'Bahan Berkualitas', 'Segar dan pilihan'],
                ['heart', 'Tradisional', 'Terpercaya keluarga'],
              ].map(([icon, title, description], index) => (
                <div
                  key={title}
                  className={`flex items-center gap-3 py-5 sm:px-5 lg:py-7 ${
                    index > 0 ? 'border-t border-white/15 sm:border-l sm:border-t-0' : ''
                  }`}
                >
                  <span className="text-[#f4d58d]">
                    <Icon name={icon} size={27} />
                  </span>
                  <span>
                    <b className="block text-sm">{title}</b>
                    <small className="text-xs text-[#b9cbc2]">{description}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="produk-beranda" className="bg-white py-24">
          <div className="mx-auto max-w-[1240px] px-5 lg:px-8">
            <div className="max-w-2xl">
              <div>
                <p className="eyebrow">Dibuat segar setiap hari</p>
                <h2 className="section-title">Semua produk kami</h2>
                <p className="mt-4 text-lg leading-8 text-[#696d67]">
                  Pilih langsung dari seluruh varian Getuk Gondok dan jajanan tradisional kami.
                </p>
              </div>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {orderedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={onAdd} />
              ))}
            </div>
          </div>
        </section>
        <section
          id="tentang"
          className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-24 lg:grid-cols-2 lg:px-8"
        >
          <div className="relative aspect-[5/4] overflow-hidden rounded-[30px]">
            <Image
              src="https://images.unsplash.com/photo-1644143494719-9de5c23eeb89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
              alt="Penyajian jajanan tradisional Indonesia"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Tentang Getuk Gondok</p>
            <h2 className="section-title">Resep keluarga yang terus hidup</h2>
            <p className="mt-6 text-lg leading-8 text-[#626760]">{settings.about}</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#edf3ea] p-5">
                <b className="text-[#265c47]">Bahan alami</b>
                <p className="mt-2 text-sm leading-6 text-[#67716b]">
                  Singkong dan kelapa segar pilihan.
                </p>
              </div>
              <div className="rounded-2xl bg-[#fbefdf] p-5">
                <b className="text-[#a64b31]">Tanpa kompromi</b>
                <p className="mt-2 text-sm leading-6 text-[#77685b]">
                  Dibuat dalam jumlah terbatas setiap hari.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

function Catalog({
  products,
  onAdd,
  count,
}: {
  products: Product[]
  onAdd: (p: Product) => void
  count: number
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('semua')
  const [sort, setSort] = useState('default')
  const shown = useMemo(
    () =>
      [...products]
        .filter(
          (p) =>
            (category === 'semua' || p.category === category) &&
            p.name.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) => {
          if (sort === 'low') return a.price - b.price
          if (sort === 'high') return b.price - a.price
          return catalogOrder.indexOf(a.slug) - catalogOrder.indexOf(b.slug)
        }),
    [products, query, category, sort],
  )
  return (
    <>
      <Header cartCount={count} />
      <main className="mx-auto max-w-[1240px] px-5 py-14 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">Katalog kami</p>
          <h1 className="page-title">Pilih manis favoritmu</h1>
          <p className="mt-4 text-lg text-[#696d67]">
            Dibuat segar setiap hari. Pesan lebih awal agar tidak kehabisan.
          </p>
        </div>
        <div className="mt-10 grid gap-3 rounded-2xl border border-[#e4dccf] bg-white p-3 md:grid-cols-[1fr_auto_auto]">
          <label className="flex items-center gap-3 rounded-xl bg-[#f6f3ec] px-4">
            <Icon name="search" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 w-full bg-transparent outline-none"
              placeholder="Cari produk..."
            />
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 rounded-xl border border-[#ded6ca] bg-white px-4 font-semibold"
          >
            <option value="semua">Semua kategori</option>
            <option value="getuk">Getuk</option>
            <option value="jajanan">Jajanan tradisional</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-12 rounded-xl border border-[#ded6ca] bg-white px-4 font-semibold"
          >
            <option value="default">Urutkan</option>
            <option value="low">Harga termurah</option>
            <option value="high">Harga termahal</option>
          </select>
        </div>
        <div className="mt-4 text-sm font-semibold text-[#72766f]">
          {shown.length} produk ditemukan
        </div>
        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} />
          ))}
        </div>
        {shown.length === 0 && (
          <div className="my-20 text-center">
            <h3 className="font-serif text-2xl">Produk tidak ditemukan</h3>
            <p className="mt-2 text-[#777]">Coba kata kunci atau kategori lain.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

function Detail({
  product,
  onAdd,
  count,
}: {
  product?: Product
  onAdd: (p: Product, qty?: number) => void
  count: number
}) {
  const [qty, setQty] = useState(1)
  if (!product)
    return (
      <>
        <Header cartCount={count} />
        <main className="mx-auto max-w-4xl px-5 py-32 text-center">
          <h1 className="page-title">Produk tidak ditemukan</h1>
          <Link
            href="/produk"
            className="mt-8 inline-block rounded-full bg-[#265c47] px-6 py-3 font-bold text-white"
          >
            Kembali ke katalog
          </Link>
        </main>
      </>
    )
  return (
    <>
      <Header cartCount={count} />
      <main className="mx-auto grid max-w-[1180px] gap-12 px-5 py-12 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div className="relative aspect-[3/2] overflow-hidden rounded-[30px] bg-[#eee8dc]">
          <Image
            src={productImage(product)}
            alt={product.name}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="self-center">
          <Link href="/produk" className="text-sm font-bold text-[#6f775f]">
            Katalog / {product.category === 'getuk' ? 'Getuk' : 'Jajanan'}
          </Link>
          <h1 className="mt-5 font-serif text-4xl font-bold text-[#173d30] sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl font-bold text-[#bd4d2f]">{money(product.price)}</p>
          <div className="mt-5 inline-flex rounded-full bg-[#edf3ea] px-4 py-2 text-sm font-bold text-[#35634e]">
            {product.stock > 0 ? `Tersedia · ${product.stock} stok` : 'Stok Habis'}
          </div>
          <p className="mt-7 text-lg leading-8 text-[#626760]">{product.description}</p>
          {product.size && (
            <div className="mt-6 border-y border-[#e5ddd0] py-5">
              <span className="text-sm text-[#7b7e78]">Ukuran kemasan</span>
              <b className="ml-4 text-[#29493c]">{product.size}</b>
            </div>
          )}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-[#d8cfc0] bg-white">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="grid h-12 w-12 place-items-center"
              >
                <Icon name="minus" />
              </button>
              <b className="w-9 text-center">{qty}</b>
              <button
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="grid h-12 w-12 place-items-center"
              >
                <Icon name="plus" />
              </button>
            </div>
            <button
              disabled={product.stock <= 0}
              onClick={() => onAdd(product, qty)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#265c47] px-6 font-bold text-white disabled:bg-[#aaa]"
            >
              <Icon name="cart" /> Tambah ke Keranjang
            </button>
          </div>
          <button
            disabled={product.stock <= 0}
            onClick={() => {
              onAdd(product, qty)
              location.href = '/keranjang'
            }}
            className="mt-3 h-12 w-full rounded-full border border-[#265c47] font-bold text-[#265c47]"
          >
            Pesan Sekarang
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Cart({ items, setItems }: { items: CartItem[]; setItems: (i: CartItem[]) => void }) {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const change = (id: string, q: number) =>
    setItems(
      items.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, Math.min(i.stock, q)) } : i)),
    )
  return (
    <>
      <Header cartCount={items.reduce((s, i) => s + i.quantity, 0)} />
      <main className="mx-auto max-w-[1120px] px-5 py-14 lg:px-8">
        <p className="eyebrow">Pesananmu</p>
        <h1 className="page-title">Keranjang belanja</h1>
        {items.length === 0 ? (
          <div className="mt-12 rounded-[28px] border border-dashed border-[#d8cdbc] bg-white p-16 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#edf3ea] text-[#265c47]">
              <Icon name="cart" size={28} />
            </span>
            <h2 className="mt-5 font-serif text-2xl font-bold">Keranjang masih kosong</h2>
            <p className="mt-2 text-[#73766f]">Temukan getuk dan jajanan tradisional favoritmu.</p>
            <Link
              href="/produk"
              className="mt-7 inline-flex rounded-full bg-[#265c47] px-6 py-3 font-bold text-white"
            >
              Lihat Produk
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {items.map((i) => (
                <div
                  key={i.id}
                  className="grid grid-cols-[84px_1fr] gap-4 rounded-2xl border border-[#e6ded1] bg-white p-4 sm:grid-cols-[96px_1fr_auto]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    <Image src={productImage(i)} alt={i.name} fill className="object-contain" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#173d30]">{i.name}</h3>
                    <p className="mt-1 text-sm text-[#7a7d76]">{money(i.price)} / pcs</p>
                    <div className="mt-4 inline-flex items-center rounded-full border border-[#ddd4c6]">
                      <button onClick={() => change(i.id, i.quantity - 1)} className="p-2">
                        <Icon name="minus" size={16} />
                      </button>
                      <b className="w-8 text-center text-sm">{i.quantity}</b>
                      <button onClick={() => change(i.id, i.quantity + 1)} className="p-2">
                        <Icon name="plus" size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-end justify-between border-t border-[#eee7dc] pt-3 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-right">
                    <b>{money(i.price * i.quantity)}</b>
                    <button
                      onClick={() => setItems(items.filter((x) => x.id !== i.id))}
                      className="mt-6 flex items-center gap-1 text-sm font-semibold text-[#a34331] sm:ml-auto"
                    >
                      <Icon name="trash" size={16} /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <aside className="h-fit rounded-[24px] bg-[#173d30] p-7 text-white">
              <h2 className="font-serif text-2xl font-bold">Ringkasan</h2>
              <div className="mt-6 space-y-3 text-sm text-[#c6d3cc]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{money(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pengiriman</span>
                  <span>Dikonfirmasi</span>
                </div>
              </div>
              <div className="my-6 border-t border-white/20" />
              <div className="flex items-end justify-between">
                <span>Total</span>
                <b className="text-2xl text-[#f4d58d]">{money(total)}</b>
              </div>
              <Link
                href="/checkout"
                className="mt-7 flex h-13 items-center justify-center gap-2 rounded-full bg-[#f4d58d] font-bold text-[#173d30]"
              >
                Lanjutkan Pemesanan <Icon name="arrow" />
              </Link>
            </aside>
          </div>
        )}
      </main>
    </>
  )
}

function Checkout({ items, clear }: { items: CartItem[]; clear: () => void }) {
  const router = useRouter()
  const [settings] = useSiteSettings()
  const [method, setMethod] = useState('bank')
  const [done, setDone] = useState(false)
  const [createdOrderNumber, setCreatedOrderNumber] = useState('')
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  if (done)
    return (
      <>
        <Header cartCount={0} />
        <main className="mx-auto max-w-xl px-5 py-28 text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#dcebdd] text-[#265c47]">
            <Icon name="check" size={36} />
          </span>
          <p className="eyebrow mt-7">Pesanan berhasil dibuat</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-[#173d30]">Terima kasih!</h1>
          <p className="mt-4 text-[#6f736d]">Nomor pesanan Anda</p>
          <div className="mt-4 rounded-2xl bg-white p-5 text-2xl font-bold tracking-wider text-[#bd4d2f]">
            {createdOrderNumber}
          </div>
          <p className="mt-5 rounded-full bg-[#fbefdf] px-4 py-2 text-sm font-bold text-[#9b5c37]">
            Menunggu Konfirmasi · Pembayaran Menunggu
          </p>
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
      <Header cartCount={items.length} />
      <main className="mx-auto max-w-[1120px] px-5 py-14 lg:px-8">
        <p className="eyebrow">Satu langkah lagi</p>
        <h1 className="page-title">Checkout</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const orderNumber = `GG-WEB-${Date.now().toString().slice(-6)}`
            const pendingOrder = {
              id: orderNumber,
              customer: String(formData.get('customerName') || ''),
              phone: String(formData.get('phone') || ''),
              address: String(formData.get('address') || ''),
              date: new Date().toLocaleString('id-ID', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }),
              total,
              method: method === 'bank' ? 'Transfer Bank' : method === 'qris' ? 'QRIS' : 'Tunai',
              paymentStatus: method === 'cash' ? 'Tunai' : 'Menunggu',
              orderStatus: 'Menunggu Konfirmasi',
              items: items.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              proof: method === 'cash' ? undefined : '/payment-proof-demo.png',
            }
            const savedOrders = JSON.parse(localStorage.getItem('getuk-pending-orders') || '[]')
            localStorage.setItem(
              'getuk-pending-orders',
              JSON.stringify([pendingOrder, ...savedOrders]),
            )
            window.dispatchEvent(new CustomEvent('getuk-orders-changed'))
            setCreatedOrderNumber(orderNumber)
            clear()
            setDone(true)
          }}
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
                  {[
                    ['bank', 'Transfer Bank'],
                    ['qris', 'QRIS / E-wallet'],
                    ['cash', 'Tunai'],
                  ].map(([v, l]) => (
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
                      <input required type="file" accept="image/*" />
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
                      <input required type="file" accept="image/*" />
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
            </div>
            <div className="my-6 border-t border-[#e3dbce]" />
            <div className="flex items-end justify-between">
              <span>Total</span>
              <b className="text-2xl text-[#bd4d2f]">{money(total)}</b>
            </div>
            <button
              disabled={!items.length}
              className="mt-7 h-13 w-full rounded-full bg-[#265c47] font-bold text-white disabled:bg-[#aaa]"
            >
              Buat Pesanan
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

const sampleOrders = [
  {
    no: 'GG-2026-0178',
    date: '17 Jun 2026',
    total: 45000,
    status: 'Diproses',
    payment: 'Terverifikasi',
  },
  {
    no: 'GG-2026-0152',
    date: '10 Jun 2026',
    total: 70000,
    status: 'Selesai',
    payment: 'Terverifikasi',
  },
  {
    no: 'GG-2026-0114',
    date: '28 Mei 2026',
    total: 30000,
    status: 'Dibatalkan',
    payment: 'Ditolak',
  },
]
function History({ count }: { count: number }) {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <>
      <Header cartCount={count} />
      <main className="mx-auto max-w-[1000px] px-5 py-14">
        <p className="eyebrow">Pesanan Anda</p>
        <h1 className="page-title">Riwayat pesanan</h1>
        <div className="mt-10 space-y-4">
          {sampleOrders.map((o) => (
            <div
              key={o.no}
              className="grid gap-5 rounded-2xl border border-[#e4dccf] bg-white p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
            >
              <div>
                <span className="text-xs text-[#7d807a]">Nomor pesanan</span>
                <b className="mt-1 block text-[#173d30]">{o.no}</b>
                <span className="mt-2 block text-sm text-[#7d807a]">{o.date}</span>
              </div>
              <div>
                <b className="block">{money(o.total)}</b>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="status">{o.status}</span>
                  <span className="status">{o.payment}</span>
                </div>
              </div>
              <button
                onClick={() => setSelected(selected === o.no ? null : o.no)}
                className="rounded-full border border-[#265c47] px-5 py-2 text-sm font-bold text-[#265c47]"
              >
                {selected === o.no ? 'Tutup Detail' : 'Lihat Detail'}
              </button>
              {selected === o.no && (
                <div className="rounded-xl bg-[#f6f3ec] p-4 text-sm leading-6 text-[#59625c] sm:col-span-3">
                  Pesanan berisi produk Getuk Gondok dan jajanan tradisional. Status terakhir:{' '}
                  <b>{o.status}</b>. Pembayaran: <b>{o.payment}</b>.
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

type AdminOrder = {
  id: string
  customer: string
  phone: string
  address: string
  date: string
  total: number
  method: 'Transfer Bank' | 'QRIS' | 'Tunai'
  paymentStatus: 'Menunggu' | 'Terverifikasi' | 'Ditolak' | 'Tunai'
  orderStatus: 'Menunggu Konfirmasi' | 'Diproses' | 'Selesai' | 'Dibatalkan'
  items: { name: string; quantity: number; price: number }[]
  proof?: string
}

const initialAdminOrders: AdminOrder[] = [
  {
    id: 'GG-0182',
    customer: 'Dewi Lestari',
    phone: '0856-4373-0540',
    address: 'Jl. Pahlawan No. 18, Magelang Utara',
    date: '18 Jun 2026 · 09.42',
    total: 45000,
    method: 'Transfer Bank',
    paymentStatus: 'Menunggu',
    orderStatus: 'Menunggu Konfirmasi',
    items: [
      { name: 'Getuk Gondok MIX', quantity: 1, price: 30000 },
      { name: 'Klepon', quantity: 1, price: 10000 },
      { name: 'Jongkong', quantity: 1, price: 5000 },
    ],
    proof: '/payment-proof-demo.png',
  },
  {
    id: 'GG-0181',
    customer: 'Ari Wibowo',
    phone: '0821-4402-8801',
    address: 'Mertoyudan, Kabupaten Magelang',
    date: '18 Jun 2026 · 08.15',
    total: 80000,
    method: 'QRIS',
    paymentStatus: 'Terverifikasi',
    orderStatus: 'Diproses',
    items: [
      { name: 'Getuk Gondok XL', quantity: 2, price: 25000 },
      { name: 'Wingko', quantity: 1, price: 20000 },
      { name: 'Klepon', quantity: 1, price: 10000 },
    ],
    proof: '/payment-proof-demo.png',
  },
  {
    id: 'GG-0180',
    customer: 'Sinta Dewi',
    phone: '0857-1234-9088',
    address: 'Muntilan, Kabupaten Magelang',
    date: '17 Jun 2026 · 16.20',
    total: 30000,
    method: 'Tunai',
    paymentStatus: 'Tunai',
    orderStatus: 'Menunggu Konfirmasi',
    items: [{ name: 'Getuk Gondok MIX', quantity: 1, price: 30000 }],
  },
]

function AdminWorkspace({
  section,
  products,
  onProductsChange,
}: {
  section: string
  products: Product[]
  onProductsChange: (products: Product[]) => void
}) {
  const [orders, setOrders] = useState(initialAdminOrders)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [productDraft, setProductDraft] = useState<Product | null>(null)
  const [productBusy, setProductBusy] = useState<string | null>(null)
  const [productMessage, setProductMessage] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [statusSaved, setStatusSaved] = useState<string | null>(null)
  const [siteSettings, saveSiteSettings] = useSiteSettings()
  const [draft, setDraft] = useState(siteSettings)

  useEffect(() => setDraft(siteSettings), [siteSettings])
  useEffect(() => {
    const loadOrders = () => {
      try {
        const pending = JSON.parse(
          localStorage.getItem('getuk-pending-orders') || '[]',
        ) as AdminOrder[]
        setOrders([
          ...pending,
          ...initialAdminOrders.filter(
            (sample) => !pending.some((order) => order.id === sample.id),
          ),
        ])
      } catch {
        setOrders(initialAdminOrders)
      }
    }
    loadOrders()
    window.addEventListener('getuk-orders-changed', loadOrders)
    return () => window.removeEventListener('getuk-orders-changed', loadOrders)
  }, [])

  const updateOrder = (id: string, changes: Partial<AdminOrder>) => {
    setOrders((current) => {
      const next = current.map((order) => (order.id === id ? { ...order, ...changes } : order))
      localStorage.setItem(
        'getuk-pending-orders',
        JSON.stringify(next.filter((order) => order.id.startsWith('GG-WEB-'))),
      )
      return next
    })
    setStatusSaved(id)
  }

  const patchProduct = async (id: string, data: Record<string, unknown>) => {
    setProductBusy(id)
    setProductMessage(null)
    try {
      const response = await fetch(`/store-api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Produk gagal diperbarui.')
      onProductsChange(products.map((product) => (product.id === id ? result.product : product)))
      if (selectedProduct?.id === id) {
        setSelectedProduct(result.product)
        setProductDraft(result.product)
      }
      setProductMessage('Perubahan produk berhasil disimpan.')
      return result.product as Product
    } catch (error) {
      setProductMessage(error instanceof Error ? error.message : 'Produk gagal diperbarui.')
      return null
    } finally {
      setProductBusy(null)
    }
  }

  const confirmOrder = async (order: AdminOrder) => {
    const stockItems = order.items
      .map((item) => {
        const product = products.find((candidate) => candidate.name === item.name)
        return product ? { productId: product.id, quantity: item.quantity } : null
      })
      .filter(Boolean)

    if (stockItems.length !== order.items.length) {
      setStatusSaved(`error:${order.id}`)
      return
    }

    setProductBusy(order.id)
    try {
      const response = await fetch('/store-api/admin/orders/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: order.id, items: stockItems }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Konfirmasi gagal.')

      updateOrder(order.id, {
        paymentStatus: order.method === 'Tunai' ? 'Tunai' : 'Terverifikasi',
        orderStatus: 'Diproses',
      })
      const productsResponse = await fetch('/store-api/products')
      const productsResult = await productsResponse.json()
      onProductsChange(productsResult.products || products)
      setStatusSaved(result.alreadyApplied ? `already:${order.id}` : order.id)
    } catch (error) {
      setProductMessage(error instanceof Error ? error.message : 'Konfirmasi gagal.')
      setStatusSaved(`error:${order.id}`)
    } finally {
      setProductBusy(null)
    }
  }

  const customers = [
    ['Dewi Lestari', 'dewi@email.com', '0812 8899 1200', 'Magelang Utara'],
    ['Ari Wibowo', 'ari@email.com', '0821 4402 8801', 'Mertoyudan'],
    ['Sinta Dewi', 'sinta@email.com', '0857 1234 9088', 'Muntilan'],
    ['Raka Pratama', 'raka@email.com', '0813 7790 4421', 'Secang'],
  ]
  const selected = orders.find((order) => order.id === selectedOrder)

  if (section === 'Data Pesanan')
    return (
      <section className="mt-8 overflow-hidden rounded-2xl border border-[#e3ddd2] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#173d30]">Data Pesanan</h2>
            <p className="mt-1 text-sm text-[#7d807a]">
              Konfirmasi pembayaran dan perbarui proses pesanan.
            </p>
          </div>
          <span className="rounded-full bg-[#fbefdf] px-4 py-2 text-sm font-bold text-[#a55335]">
            3 pesanan aktif
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-[#f6f4ef] text-[#747872]">
              <tr>
                {['Pesanan', 'Pelanggan', 'Tanggal', 'Total', 'Pembayaran', 'Status', 'Aksi'].map(
                  (heading) => (
                    <th key={heading} className="px-5 py-3">
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-[#eee8de]">
                  <td className="px-5 py-4 font-bold text-[#173d30]">{order.id}</td>
                  <td className="px-5 py-4 font-medium">{order.customer}</td>
                  <td className="px-5 py-4 font-medium">{order.date.split(' · ')[0]}</td>
                  <td className="px-5 py-4 font-semibold">{money(order.total)}</td>
                  <td className="px-5 py-4">
                    <span className="block font-medium">{order.method}</span>
                    <span className="mt-1 block text-xs text-[#7c8079]">{order.paymentStatus}</span>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(event) =>
                        updateOrder(order.id, {
                          orderStatus: event.target.value as AdminOrder['orderStatus'],
                        })
                      }
                      className="min-w-44 py-2 text-xs font-bold"
                    >
                      <option>Menunggu Konfirmasi</option>
                      <option>Diproses</option>
                      <option>Selesai</option>
                      <option>Dibatalkan</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(order.id)
                        setStatusSaved(null)
                      }}
                      className="rounded-full border border-[#265c47] px-4 py-2 font-bold text-[#265c47] hover:bg-[#edf3ea]"
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selected && (
          <div className="m-5 overflow-hidden rounded-2xl border border-[#dcd4c7] bg-[#faf8f3]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e3dcd0] p-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-[.14em] text-[#a55335]">
                  Detail Pesanan
                </span>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#173d30]">{selected.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="grid h-10 w-10 place-items-center rounded-full border border-[#d5ccbd] bg-white"
                aria-label="Tutup detail pesanan"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
            <div className="grid gap-6 p-5 xl:grid-cols-[1fr_340px]">
              <div className="space-y-5">
                <div className="grid gap-4 rounded-xl bg-white p-5 sm:grid-cols-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#85877f]">
                      Pelanggan
                    </span>
                    <b className="mt-2 block text-[#173d30]">{selected.customer}</b>
                    <span className="mt-1 block text-sm text-[#6f736c]">{selected.phone}</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#85877f]">
                      Alamat
                    </span>
                    <p className="mt-2 text-sm leading-6 text-[#555f58]">{selected.address}</p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border border-[#e4ddd1] bg-white">
                  <div className="border-b border-[#eee8de] px-5 py-4">
                    <b className="text-[#173d30]">Rincian Produk</b>
                  </div>
                  {selected.items.map((item) => (
                    <div
                      key={item.name}
                      className="grid grid-cols-[1fr_auto] gap-4 border-b border-[#f0ebe3] px-5 py-4 text-sm last:border-0"
                    >
                      <span>
                        {item.name} <b>×{item.quantity}</b>
                      </span>
                      <b>{money(item.price * item.quantity)}</b>
                    </div>
                  ))}
                  <div className="flex justify-between bg-[#f7f4ee] px-5 py-4">
                    <b>Total Pembayaran</b>
                    <b className="text-lg text-[#bd4d2f]">{money(selected.total)}</b>
                  </div>
                </div>
                <div className="grid gap-4 rounded-xl bg-white p-5 sm:grid-cols-2">
                  <label>
                    Status pembayaran
                    <select
                      value={selected.paymentStatus}
                      onChange={(event) =>
                        updateOrder(selected.id, {
                          paymentStatus: event.target.value as AdminOrder['paymentStatus'],
                        })
                      }
                    >
                      <option>Menunggu</option>
                      <option>Terverifikasi</option>
                      <option>Ditolak</option>
                      <option>Tunai</option>
                    </select>
                  </label>
                  <label>
                    Status pesanan
                    <select
                      value={selected.orderStatus}
                      onChange={(event) =>
                        updateOrder(selected.id, {
                          orderStatus: event.target.value as AdminOrder['orderStatus'],
                        })
                      }
                    >
                      <option>Menunggu Konfirmasi</option>
                      <option>Diproses</option>
                      <option>Selesai</option>
                      <option>Dibatalkan</option>
                    </select>
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => confirmOrder(selected)}
                    disabled={productBusy === selected.id}
                    className="inline-flex items-center gap-2 rounded-full bg-[#265c47] px-6 py-3 font-bold text-white disabled:cursor-wait disabled:opacity-60"
                  >
                    <Icon name="check" size={18} />{' '}
                    {productBusy === selected.id ? 'Memproses...' : 'Konfirmasi Pesanan'}
                  </button>
                  <button
                    onClick={() => setStatusSaved(selected.id)}
                    className="rounded-full border border-[#265c47] px-6 py-3 font-bold text-[#265c47]"
                  >
                    Simpan Status
                  </button>
                  {statusSaved === selected.id && (
                    <span className="text-sm font-bold text-[#4d8067]">
                      Pesanan dikonfirmasi dan stok otomatis dikurangi.
                    </span>
                  )}
                  {statusSaved === `already:${selected.id}` && (
                    <span className="text-sm font-bold text-[#8b674c]">
                      Pesanan sudah pernah dikonfirmasi; stok tidak dikurangi lagi.
                    </span>
                  )}
                  {statusSaved === `error:${selected.id}` && (
                    <span className="text-sm font-bold text-red-700">
                      {productMessage || 'Konfirmasi gagal. Periksa stok dan login admin.'}
                    </span>
                  )}
                </div>
              </div>
              <aside className="h-fit rounded-xl border border-[#e3dcd0] bg-white p-4">
                <span className="text-xs font-bold uppercase tracking-[.14em] text-[#85877f]">
                  {selected.method === 'Tunai' ? 'Konfirmasi Tunai' : 'Bukti Pembayaran'}
                </span>
                {selected.method === 'Tunai' ? (
                  <div className="mt-4">
                    <div className="rounded-xl bg-[#fbefdf] p-5">
                      <b className="text-[#8b4a2e]">Pembayaran saat pesanan diterima</b>
                      <p className="mt-2 text-sm leading-6 text-[#745f50]">
                        Hubungi pelanggan untuk memastikan pesanan dan waktu pengambilan.
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/${selected.phone.replace(/\D/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(`Halo ${selected.customer}, kami dari Getuk Gondok ingin mengonfirmasi pesanan ${selected.id} dengan pembayaran tunai.`)}`}
                      target="_blank"
                      className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-bold text-white"
                    >
                      Hubungi via WhatsApp <Icon name="arrow" size={17} />
                    </a>
                    <a
                      href={`tel:${selected.phone}`}
                      className="mt-3 flex items-center justify-center rounded-full border border-[#d9d0c3] px-5 py-3 text-sm font-bold text-[#375347]"
                    >
                      Telepon {selected.phone}
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="relative mt-4 aspect-[3/4] overflow-hidden rounded-xl bg-[#eee9e0]">
                      <Image
                        src={selected.proof || '/payment-proof-demo.png'}
                        alt={`Bukti pembayaran ${selected.id}`}
                        fill
                        className="object-cover"
                        sizes="340px"
                      />
                    </div>
                    <a
                      href={selected.proof || '/payment-proof-demo.png'}
                      target="_blank"
                      className="mt-3 block text-center text-sm font-bold text-[#265c47]"
                    >
                      Buka Foto Penuh
                    </a>
                  </>
                )}
              </aside>
            </div>
          </div>
        )}
      </section>
    )

  if (section === 'Data Produk')
    return (
      <section className="mt-8 rounded-2xl border border-[#e3ddd2] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#173d30]">Data Produk</h2>
            <p className="mt-1 text-sm text-[#7d807a]">
              Edit detail dan sesuaikan stok tanpa membuka tabel Payload.
            </p>
          </div>
          <Link
            href="/admin/collections/products/create"
            className="inline-flex items-center gap-2 rounded-full bg-[#265c47] px-5 py-3 text-sm font-bold text-white"
          >
            <Icon name="plus" size={17} /> Tambah Produk
          </Link>
        </div>
        {productMessage && (
          <div className="mx-6 mb-5 rounded-xl bg-[#edf3ea] px-4 py-3 text-sm font-bold text-[#375347]">
            {productMessage}
          </div>
        )}
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-[#e4ddd2] bg-[#fffdf8]"
            >
              <div className="relative aspect-[3/2] bg-[#eee8dd]">
                <Image
                  src={productImage(product)}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                    product.stock > 0 ? 'bg-white/90 text-[#265c47]' : 'bg-red-700 text-white'
                  }`}
                >
                  {product.stock > 0 ? 'Tersedia' : 'Stok Habis'}
                </span>
              </div>
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#a55335]">
                  {product.category === 'getuk' ? 'Getuk' : 'Jajanan Tradisional'}
                </span>
                <h3 className="mt-1 font-serif text-xl font-bold text-[#173d30]">{product.name}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <b className="text-[#bd4d2f]">{money(product.price)}</b>
                  <button
                    onClick={() => {
                      setSelectedProduct(product)
                      setProductDraft(product)
                      setProductMessage(null)
                    }}
                    className="rounded-full border border-[#265c47] px-4 py-2 text-xs font-bold text-[#265c47]"
                  >
                    Edit Detail
                  </button>
                </div>
                <div className="mt-5 rounded-xl bg-[#f2efe8] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#747872]">
                      Stok saat ini
                    </span>
                    <b className="text-xl text-[#173d30]">{product.stock}</b>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    <button
                      disabled={product.stock <= 0 || productBusy === product.id}
                      onClick={() => patchProduct(product.id, { stockDelta: -1 })}
                      className="grid h-10 place-items-center rounded-lg border border-[#d8cfc1] bg-white font-bold disabled:opacity-40"
                      aria-label={`Kurangi stok ${product.name}`}
                    >
                      −
                    </button>
                    <button
                      disabled={productBusy === product.id}
                      onClick={() => patchProduct(product.id, { stockDelta: 1 })}
                      className="grid h-10 place-items-center rounded-lg bg-[#265c47] font-bold text-white disabled:opacity-40"
                      aria-label={`Tambah stok ${product.name}`}
                    >
                      +1
                    </button>
                    <button
                      disabled={productBusy === product.id}
                      onClick={() => patchProduct(product.id, { stockDelta: 5 })}
                      className="grid h-10 place-items-center rounded-lg bg-[#dcebdd] text-sm font-bold text-[#265c47] disabled:opacity-40"
                    >
                      +5
                    </button>
                    <button
                      disabled={productBusy === product.id}
                      onClick={() => patchProduct(product.id, { stockDelta: 10 })}
                      className="grid h-10 place-items-center rounded-lg bg-[#fbefdf] text-sm font-bold text-[#a55335] disabled:opacity-40"
                    >
                      +10
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        {productDraft && selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-end justify-end bg-[#10251d]/45 p-0 backdrop-blur-sm sm:p-5">
            <div className="h-[94vh] w-full max-w-xl overflow-y-auto rounded-t-[28px] bg-white p-6 shadow-2xl sm:h-full sm:rounded-[28px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="eyebrow">Editor Produk</span>
                  <h3 className="mt-2 font-serif text-3xl font-bold text-[#173d30]">
                    {selectedProduct.name}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(null)
                    setProductDraft(null)
                  }}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#ded6ca]"
                  aria-label="Tutup editor produk"
                >
                  <Icon name="close" />
                </button>
              </div>
              <div className="relative mt-6 aspect-[3/2] overflow-hidden rounded-2xl bg-[#eee8dd]">
                <Image
                  src={productImage(productDraft)}
                  alt={productDraft.name}
                  fill
                  className="object-contain"
                  sizes="560px"
                />
              </div>
              <form
                onSubmit={async (event) => {
                  event.preventDefault()
                  const updated = await patchProduct(productDraft.id, {
                    name: productDraft.name,
                    description: productDraft.description,
                    price: productDraft.price,
                    stock: productDraft.stock,
                    size: productDraft.size || '',
                    category: productDraft.category,
                    featured: Boolean(productDraft.featured),
                  })
                  if (updated) setProductDraft(updated)
                }}
                className="mt-6 grid gap-5"
              >
                <label>
                  Nama produk
                  <input
                    required
                    value={productDraft.name}
                    onChange={(event) =>
                      setProductDraft({ ...productDraft, name: event.target.value })
                    }
                  />
                </label>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label>
                    Harga
                    <input
                      required
                      type="number"
                      min="0"
                      value={productDraft.price}
                      onChange={(event) =>
                        setProductDraft({ ...productDraft, price: Number(event.target.value) })
                      }
                    />
                  </label>
                  <label>
                    Stok
                    <input
                      required
                      type="number"
                      min="0"
                      step="1"
                      value={productDraft.stock}
                      onChange={(event) =>
                        setProductDraft({ ...productDraft, stock: Number(event.target.value) })
                      }
                    />
                  </label>
                  <label>
                    Kategori
                    <select
                      value={productDraft.category}
                      onChange={(event) =>
                        setProductDraft({
                          ...productDraft,
                          category: event.target.value as Product['category'],
                        })
                      }
                    >
                      <option value="getuk">Getuk</option>
                      <option value="jajanan">Jajanan Tradisional</option>
                    </select>
                  </label>
                  <label>
                    Ukuran kemasan
                    <input
                      value={productDraft.size || ''}
                      onChange={(event) =>
                        setProductDraft({ ...productDraft, size: event.target.value })
                      }
                    />
                  </label>
                </div>
                <label>
                  Deskripsi produk
                  <textarea
                    required
                    rows={5}
                    value={productDraft.description}
                    onChange={(event) =>
                      setProductDraft({ ...productDraft, description: event.target.value })
                    }
                  />
                </label>
                <label className="flex grid-cols-none items-center gap-3 rounded-xl bg-[#f6f3ec] p-4">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={Boolean(productDraft.featured)}
                    onChange={(event) =>
                      setProductDraft({ ...productDraft, featured: event.target.checked })
                    }
                  />
                  Jadikan produk unggulan di website
                </label>
                <div className="sticky bottom-0 flex gap-3 border-t border-[#e6dfd4] bg-white py-4">
                  <button
                    disabled={productBusy === productDraft.id}
                    className="flex-1 rounded-full bg-[#265c47] px-6 py-3 font-bold text-white disabled:opacity-50"
                  >
                    {productBusy === productDraft.id ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <Link
                    href="/admin/collections/products"
                    className="rounded-full border border-[#d7cebf] px-5 py-3 text-sm font-bold text-[#59625c]"
                  >
                    Kelola Foto
                  </Link>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    )

  if (section === 'Data Pelanggan')
    return (
      <section className="mt-8 overflow-hidden rounded-2xl border border-[#e3ddd2] bg-white">
        <div className="p-6">
          <h2 className="font-serif text-2xl font-bold text-[#173d30]">Data Pelanggan</h2>
          <p className="mt-1 text-sm text-[#7d807a]">Informasi pelanggan dan riwayat transaksi.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#f6f4ef] text-[#747872]">
              <tr>
                {['Nama', 'Email', 'Nomor HP', 'Alamat', 'Pesanan'].map((heading) => (
                  <th key={heading} className="px-6 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer[1]} className="border-t border-[#eee8de]">
                  {customer.map((value) => (
                    <td key={value} className="px-6 py-4 font-medium">
                      {value}
                    </td>
                  ))}
                  <td className="px-6 py-4 font-bold text-[#265c47]">{[8, 5, 3, 2][index]} kali</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    )

  return (
    <section className="mt-8 rounded-2xl border border-[#e3ddd2] bg-white p-6">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#173d30]">Pengaturan Website</h2>
            <p className="mt-1 text-sm text-[#7d807a]">
              Perbarui hero, profil toko, kontak, pembayaran, dan informasi publik.
            </p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-[#265c47] px-5 py-2.5 text-sm font-bold text-[#265c47]"
          >
            Lihat Website <Icon name="arrow" size={16} />
          </Link>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            saveSiteSettings(draft)
            setSaved(true)
          }}
          className="mt-7 space-y-6"
        >
          <fieldset className="rounded-2xl border border-[#e4ddd2] p-5">
            <legend className="px-2 font-serif text-xl font-bold text-[#173d30]">
              Tampilan Homepage
            </legend>
            <div className="mt-2 grid gap-5 sm:grid-cols-2">
              <label>
                Judul utama
                <input
                  value={draft.heroTitle}
                  onChange={(event) => setDraft({ ...draft, heroTitle: event.target.value })}
                />
              </label>
              <label>
                Nama pemilik
                <input
                  value={draft.heroOwner}
                  onChange={(event) => setDraft({ ...draft, heroOwner: event.target.value })}
                />
              </label>
              <label className="sm:col-span-2">
                Tagline
                <input
                  value={draft.heroTagline}
                  onChange={(event) => setDraft({ ...draft, heroTagline: event.target.value })}
                />
              </label>
              <label className="sm:col-span-2">
                Deskripsi hero
                <textarea
                  rows={3}
                  value={draft.heroDescription}
                  onChange={(event) => setDraft({ ...draft, heroDescription: event.target.value })}
                />
              </label>
              <label className="sm:col-span-2">
                Ganti foto banner
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () =>
                      setDraft({ ...draft, heroImage: String(reader.result || draft.heroImage) })
                    reader.readAsDataURL(file)
                  }}
                />
              </label>
              <div className="relative aspect-[3/1] overflow-hidden rounded-xl bg-[#eee8dd] sm:col-span-2">
                <Image
                  src={draft.heroImage}
                  alt="Pratinjau banner homepage"
                  fill
                  className="object-cover object-bottom"
                  sizes="800px"
                  unoptimized={draft.heroImage.startsWith('data:')}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-[#e4ddd2] p-5">
            <legend className="px-2 font-serif text-xl font-bold text-[#173d30]">
              Profil Toko
            </legend>
            <div className="mt-2 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                Tentang toko
                <textarea
                  rows={4}
                  value={draft.about}
                  onChange={(event) => setDraft({ ...draft, about: event.target.value })}
                />
              </label>
              <label>
                Alamat
                <input
                  value={draft.address}
                  onChange={(event) => setDraft({ ...draft, address: event.target.value })}
                />
              </label>
              <label>
                Jam operasional
                <input
                  value={draft.hours}
                  onChange={(event) => setDraft({ ...draft, hours: event.target.value })}
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-[#e4ddd2] p-5">
            <legend className="px-2 font-serif text-xl font-bold text-[#173d30]">
              Kontak & Media Sosial
            </legend>
            <div className="mt-2 grid gap-5 sm:grid-cols-3">
              <label>
                WhatsApp
                <input
                  value={draft.whatsapp}
                  onChange={(event) => setDraft({ ...draft, whatsapp: event.target.value })}
                />
              </label>
              <label>
                Instagram
                <input
                  value={draft.instagram}
                  onChange={(event) => setDraft({ ...draft, instagram: event.target.value })}
                />
              </label>
              <label>
                TikTok
                <input
                  value={draft.tiktok}
                  onChange={(event) => setDraft({ ...draft, tiktok: event.target.value })}
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-[#e4ddd2] p-5">
            <legend className="px-2 font-serif text-xl font-bold text-[#173d30]">
              Informasi Pembayaran
            </legend>
            <label className="mt-2">
              Rekening transfer
              <input
                value={draft.bankAccount}
                onChange={(event) => setDraft({ ...draft, bankAccount: event.target.value })}
              />
            </label>
          </fieldset>

          <div className="sticky bottom-4 flex flex-wrap items-center gap-4 rounded-2xl border border-[#d9d0c3] bg-white/95 p-4 shadow-xl backdrop-blur">
            <button className="rounded-full bg-[#265c47] px-6 py-3 font-bold text-white">
              Simpan Semua Perubahan
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft(defaultSiteSettings)
                setSaved(false)
              }}
              className="rounded-full border border-[#d6ccbd] px-6 py-3 font-bold text-[#59625c]"
            >
              Kembalikan Default
            </button>
            {saved && (
              <span className="text-sm font-bold text-[#4d8067]">
                Semua perubahan tersimpan dan langsung diterapkan.
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

function OwnerWorkspace({ section }: { section: string }) {
  const titles: Record<string, string> = {
    'Laporan Penjualan': 'Ringkasan penjualan harian, mingguan, dan bulanan.',
    'Laporan Produk': 'Performa produk, jumlah terjual, dan informasi stok.',
    'Laporan Pesanan': 'Seluruh transaksi dan status pemesanan.',
  }
  return (
    <section className="mt-8 rounded-2xl border border-[#e3ddd2] bg-white p-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#173d30]">{section}</h2>
          <p className="mt-1 text-sm text-[#7d807a]">{titles[section]}</p>
        </div>
        <button
          onClick={() => window.print()}
          className="rounded-full border border-[#d7cebf] px-5 py-2 text-sm font-bold"
        >
          Unduh Laporan
        </button>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ['Total Pendapatan', 'Rp18.600.000'],
          ['Jumlah Transaksi', '428'],
          ['Periode', 'Juni 2026'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-[#f6f4ef] p-5">
            <span className="text-sm text-[#777b75]">{label}</span>
            <b className="mt-2 block text-xl text-[#173d30]">{value}</b>
          </div>
        ))}
      </div>
    </section>
  )
}

const sales = [38, 52, 45, 72, 65, 88, 78]
function Dashboard({
  role,
  products,
  onProductsChange,
}: {
  role: 'admin' | 'owner'
  products: Product[]
  onProductsChange: (products: Product[]) => void
}) {
  const router = useRouter()
  const owner = role === 'owner'
  const nav = owner
    ? ['Dashboard', 'Laporan Penjualan', 'Laporan Produk', 'Laporan Pesanan']
    : ['Dashboard', 'Data Pesanan', 'Data Produk', 'Data Pelanggan', 'Pengaturan Website']
  const [active, setActive] = useState('Dashboard')
  return (
    <div className="min-h-screen bg-[#f3f1eb] lg:flex">
      <aside className="bg-[#173d30] p-5 text-white lg:fixed lg:inset-y-0 lg:w-64">
        <Link href="/" className="flex items-center gap-3 border-b border-white/15 pb-6">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f4d58d] text-[#173d30]">
            <Icon name="shop" />
          </span>
          <span>
            <b className="block font-serif">Getuk Gondok</b>
            <small className="text-[#aebfb6]">{owner ? 'Pemilik' : 'Admin'} Panel</small>
          </span>
        </Link>
        <nav className="mt-7 flex gap-2 overflow-x-auto lg:grid">
          {nav.map((n, i) => (
            <button
              key={n}
              onClick={() => setActive(n)}
              className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-semibold ${
                active === n ? 'bg-white/13 text-white' : 'text-[#b8c8c0] hover:bg-white/8'
              }`}
            >
              {n}
            </button>
          ))}
        </nav>
        <button
          onClick={async () => {
            await fetch('/store-api/auth/logout', { method: 'POST' })
            router.push('/login')
          }}
          className="mt-8 block rounded-xl border border-white/20 px-4 py-3 text-sm font-bold lg:absolute lg:bottom-6 lg:left-5 lg:right-5"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 px-5 py-8 lg:ml-64 lg:px-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#778078]">Selamat datang kembali</p>
            <h1 className="mt-1 font-serif text-3xl font-bold text-[#173d30]">
              {active === 'Dashboard' ? `Dashboard ${owner ? 'Pemilik' : 'Admin'}` : active}
            </h1>
          </div>
          <div className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#375347]">
            {owner ? 'Sri Rahayu · Pemilik' : 'Anisa · Admin'}
          </div>
        </div>
        {active === 'Dashboard' ? (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {(owner
                ? [
                    ['Total Penjualan', 'Rp 18,6 jt', 'chart'],
                    ['Total Pesanan', '428', 'box'],
                    ['Jumlah Pelanggan', '316', 'users'],
                    ['Produk Terlaris', 'Getuk MIX', 'shop'],
                  ]
                : [
                    ['Total Pesanan', '428', 'box'],
                    ['Pesanan Baru', '18', 'cart'],
                    ['Sedang Diproses', '12', 'chart'],
                    ['Stok Menipis', '3 produk', 'shop'],
                  ]
              ).map(([l, v, ic]) => (
                <div key={l} className="rounded-2xl border border-[#e3ddd2] bg-white p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf3ea] text-[#265c47]">
                    <Icon name={ic} />
                  </span>
                  <p className="mt-5 text-sm font-semibold text-[#7c8079]">{l}</p>
                  <b className="mt-1 block text-2xl text-[#173d30]">{v}</b>
                  <span className="mt-2 block text-xs font-semibold text-[#5f826f]">
                    +8,4% bulan ini
                  </span>
                </div>
              ))}
            </div>
            {owner ? (
              <div className="mt-6 rounded-2xl border border-[#e3ddd2] bg-white p-6">
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#173d30]">Tren penjualan</h2>
                    <p className="text-sm text-[#7d807a]">7 hari terakhir</p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="rounded-full border border-[#ddd5c8] px-4 text-sm font-bold"
                  >
                    Unduh Laporan
                  </button>
                </div>
                <div className="mt-10 flex h-64 items-end gap-3 border-b border-[#ddd] px-3">
                  {sales.map((s, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        style={{ height: `${s * 2.3}px` }}
                        className="w-full max-w-14 rounded-t-lg bg-[#4d8067]"
                      />
                      <span className="text-xs text-[#7b7d78]">
                        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 overflow-hidden rounded-2xl border border-[#e3ddd2] bg-white">
                <div className="flex items-center justify-between p-6">
                  <h2 className="font-serif text-2xl font-bold text-[#173d30]">Pesanan terbaru</h2>
                  <button
                    onClick={() => setActive('Data Pesanan')}
                    className="rounded-full bg-[#265c47] px-5 py-2 text-sm font-bold text-white"
                  >
                    Lihat Semua
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-[#f6f4ef] text-[#747872]">
                      <tr>
                        {[
                          'Pesanan',
                          'Pelanggan',
                          'Tanggal',
                          'Total',
                          'Pembayaran',
                          'Status',
                          'Aksi',
                        ].map((h) => (
                          <th key={h} className="px-6 py-3">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['GG-0182', 'Dewi Lestari', '18 Jun', 'Rp45.000', 'Transfer', 'Menunggu'],
                        ['GG-0181', 'Ari Wibowo', '18 Jun', 'Rp80.000', 'QRIS', 'Diproses'],
                        ['GG-0180', 'Sinta Dewi', '17 Jun', 'Rp30.000', 'Tunai', 'Selesai'],
                      ].map((r) => (
                        <tr key={r[0]} className="border-t border-[#eee8de]">
                          {r.map((c, i) => (
                            <td key={i} className="px-6 py-4 font-medium">
                              {c}
                            </td>
                          ))}
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setActive('Data Pesanan')}
                              className="font-bold text-[#265c47]"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : owner ? (
          <OwnerWorkspace section={active} />
        ) : (
          <AdminWorkspace
            section={active}
            products={products}
            onProductsChange={onProductsChange}
          />
        )}
      </main>
    </div>
  )
}

function Login() {
  const router = useRouter()
  const [role, setRole] = useState<'admin' | 'owner'>('admin')
  const [busy, setBusy] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  return (
    <main className="grid min-h-screen bg-[#f5f2eb] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1718395012128-a6d204223093?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200"
          alt="Jajanan tradisional di atas daun pisang"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#173d30]/90 via-[#173d30]/15 to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-lg text-white">
          <p className="text-sm font-bold uppercase tracking-[.18em] text-[#f4d58d]">
            Getuk Gondok Hj. Sri Rahayu
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-tight">
            Tradisi terjaga, bisnis tumbuh bersama.
          </h1>
        </div>
      </div>
      <div className="flex items-center justify-center p-5">
        <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-xl shadow-[#523b1d]/8 sm:p-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#265c47] text-white">
              <Icon name="shop" />
            </span>
            <b className="font-serif text-xl text-[#173d30]">Getuk Gondok</b>
          </Link>
          <h2 className="mt-9 font-serif text-3xl font-bold text-[#173d30]">Masuk ke panel</h2>
          <p className="mt-2 text-[#747872]">Kelola operasional atau pantau laporan bisnis.</p>
          <div className="mt-7 grid grid-cols-2 rounded-xl bg-[#f2efe8] p-1">
            <button
              onClick={() => setRole('admin')}
              className={`rounded-lg py-2.5 text-sm font-bold ${role === 'admin' ? 'bg-white text-[#265c47] shadow-sm' : 'text-[#7b7e77]'}`}
            >
              Admin
            </button>
            <button
              onClick={() => setRole('owner')}
              className={`rounded-lg py-2.5 text-sm font-bold ${role === 'owner' ? 'bg-white text-[#265c47] shadow-sm' : 'text-[#7b7e77]'}`}
            >
              Pemilik
            </button>
          </div>
          <form
            onSubmit={async (event) => {
              event.preventDefault()
              setBusy(true)
              setLoginError(null)
              const formData = new FormData(event.currentTarget)
              try {
                const response = await fetch('/store-api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    username: formData.get('username'),
                    password: formData.get('password'),
                  }),
                })
                const result = await response.json()
                if (!response.ok) throw new Error(result.error || 'Login gagal.')
                router.push(result.user.role === 'admin' ? '/admin-dashboard' : '/owner-dashboard')
              } catch (error) {
                setLoginError(error instanceof Error ? error.message : 'Login gagal.')
              } finally {
                setBusy(false)
              }
            }}
            className="mt-6 space-y-4"
          >
            <label>
              Username
              <input
                key={role}
                required
                name="username"
                defaultValue={role === 'admin' ? 'admin.getuk' : 'pemilik.getuk'}
              />
            </label>
            <label>
              Password
              <input
                required
                name="password"
                type="password"
                placeholder={role === 'admin' ? 'admin123' : 'pemilik123'}
              />
            </label>
            {loginError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                {loginError}
              </p>
            )}
            <button
              disabled={busy}
              className="mt-2 h-13 w-full rounded-full bg-[#265c47] font-bold text-white disabled:opacity-60"
            >
              {busy
                ? 'Memeriksa akun...'
                : `Masuk sebagai ${role === 'admin' ? 'Admin' : 'Pemilik'}`}
            </button>
          </form>
          <p className="mt-6 text-center text-xs leading-5 text-[#888b84]">
            Akses hanya untuk staf resmi Getuk Gondok Hj. Sri Rahayu.
          </p>
        </div>
      </div>
    </main>
  )
}

export default function AppExperience() {
  const path = usePathname()
  const [products, setProducts] = useState<Product[]>([])
  const [items, setItemsState] = useState<CartItem[]>([])
  useEffect(() => {
    fetch('/store-api/products')
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
    try {
      setItemsState(JSON.parse(localStorage.getItem('getuk-cart') || '[]'))
    } catch {}
  }, [])
  const setItems = (next: CartItem[]) => {
    setItemsState(next)
    localStorage.setItem('getuk-cart', JSON.stringify(next))
  }
  const add = (p: Product, qty = 1) => {
    const found = items.find((i) => i.id === p.id)
    setItems(
      found
        ? items.map((i) =>
            i.id === p.id ? { ...i, quantity: Math.min(i.stock, i.quantity + qty) } : i,
          )
        : [...items, { ...p, quantity: qty }],
    )
  }
  const count = items.reduce((s, i) => s + i.quantity, 0)
  const slug = path.split('/')[2]
  if (path === '/') return <Home products={products} onAdd={add} count={count} />
  if (path === '/produk') return <Catalog products={products} onAdd={add} count={count} />
  if (path.startsWith('/produk/'))
    return <Detail product={products.find((p) => p.slug === slug)} onAdd={add} count={count} />
  if (path === '/keranjang') return <Cart items={items} setItems={setItems} />
  if (path === '/checkout') return <Checkout items={items} clear={() => setItems([])} />
  if (path === '/riwayat-pesanan') return <History count={count} />
  if (path === '/login') return <Login />
  if (path === '/admin-dashboard')
    return <Dashboard role="admin" products={products} onProductsChange={setProducts} />
  if (path === '/owner-dashboard')
    return <Dashboard role="owner" products={products} onProductsChange={setProducts} />
  return <Home products={products} onAdd={add} count={count} />
}
