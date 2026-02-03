'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCart } from '@/store/useCart'
import { ShoppingBag, User, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Navigation() {
  const pathname = usePathname()
  const { items } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/store', label: 'Store' },
    { href: '/about', label: 'About' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/spotlight', label: 'Spotlight' },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 glass flex justify-between items-center px-8 py-4">
      <Link href="/" className="relative h-[96px] w-[320px] transition-opacity hover:opacity-80">
        <Image
          src="/images/ARTSYblack.png"
          alt="ArtsyGhana Logo"
          fill
          className="object-contain object-left"
          priority
        />
      </Link>
      
      <div className="flex gap-8 text-sm uppercase tracking-widest font-medium text-charcoal drop-shadow-lg">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`transition-colors drop-shadow-sm ${
              pathname === link.href
                ? 'text-burnished-gold font-semibold'
                : 'text-charcoal hover:text-burnished-gold'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <Link href="/cart" className="relative">
          <ShoppingBag className="w-5 h-5 text-charcoal drop-shadow-lg" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-burnished-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
              {cartCount}
            </span>
          )}
        </Link>
        <button className="text-charcoal hover:text-burnished-gold transition-colors drop-shadow-lg">
          <User className="w-5 h-5" />
        </button>
        <button className="text-charcoal hover:text-burnished-gold transition-colors drop-shadow-lg">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </nav>
  )
}
