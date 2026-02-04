'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCart } from '@/store/useCart'
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Navigation() {
  const pathname = usePathname()
  const { items } = useCart()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    <nav className="fixed top-0 w-full z-50 glass flex justify-between items-center px-4 sm:px-6 md:px-8 py-2">
      <Link href="/" className="relative h-10 w-32 sm:h-12 sm:w-40 transition-opacity hover:opacity-80">
        <Image
          src="/images/ARTSYblack.png"
          alt="ArtsyGhana Logo"
          fill
          className="object-contain object-left"
          priority
        />
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden lg:flex gap-6 xl:gap-8 text-sm uppercase tracking-widest font-medium text-charcoal drop-shadow-lg">
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

      {/* Desktop Icons */}
      <div className="hidden md:flex items-center gap-4 lg:gap-6">
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

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-3">
        <Link href="/cart" className="relative">
          <ShoppingBag className="w-5 h-5 text-charcoal drop-shadow-lg" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-burnished-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
              {cartCount}
            </span>
          )}
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-charcoal drop-shadow-lg p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-charcoal/10 shadow-lg md:hidden">
          <div className="flex flex-col py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-6 py-3 text-sm uppercase tracking-widest font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-burnished-gold font-semibold bg-burnished-gold/10'
                    : 'text-charcoal hover:text-burnished-gold hover:bg-burnished-gold/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 px-6 py-3 border-t border-charcoal/10 mt-2">
              <button className="text-charcoal hover:text-burnished-gold transition-colors p-2">
                <User className="w-5 h-5" />
              </button>
              <button className="text-charcoal hover:text-burnished-gold transition-colors p-2">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
