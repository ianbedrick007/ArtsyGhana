import Link from 'next/link'
import Image from 'next/image'
import { Check } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-charcoal text-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Left Column - Logo and Description */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Link href="/" className="relative inline-block h-12 w-48">
                <Image
                  src="/images/ARTSYblack.png"
                  alt="ArtsyGhana Logo"
                  fill
                  className="object-contain object-left"
                />
              </Link>
            </div>
            <p className="text-sm text-warm-gray mb-6 leading-relaxed">
              Connecting Ghana's finest contemporary artists with collectors worldwide through immersive digital experiences.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-warm-gray">
                <Check className="w-4 h-4 text-burnished-gold" />
                <span>Secure via Paystack</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-warm-gray">
                <Check className="w-4 h-4 text-burnished-gold" />
                <span>Authenticated Art</span>
              </div>
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="text-sm uppercase tracking-widest mb-6 font-medium">EXPLORE</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/gallery" className="text-sm text-warm-gray hover:text-burnished-gold transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-sm text-warm-gray hover:text-burnished-gold transition-colors">
                  Artists
                </Link>
              </li>
              <li>
                <Link href="/spotlight" className="text-sm text-warm-gray hover:text-burnished-gold transition-colors">
                  Spotlight
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-sm text-warm-gray hover:text-burnished-gold transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-warm-gray hover:text-burnished-gold transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-sm uppercase tracking-widest mb-6 font-medium">SUPPORT</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-sm text-warm-gray hover:text-burnished-gold transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-warm-gray hover:text-burnished-gold transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-warm-gray hover:text-burnished-gold transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/authentication" className="text-sm text-warm-gray hover:text-burnished-gold transition-colors">
                  Authentication
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-warm-gray hover:text-burnished-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Stay Connected Column */}
          <div>
            <h3 className="text-sm uppercase tracking-widest mb-6 font-medium">STAY CONNECTED</h3>
            <p className="text-sm text-warm-gray mb-4 leading-relaxed">
              Subscribe to receive updates on new arrivals and artist features.
            </p>
            <form className="mb-6">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-charcoal border border-warm-gray/30 px-4 py-2 text-sm text-white placeholder-warm-gray focus:outline-none focus:border-burnished-gold"
                />
                <button
                  type="submit"
                  className="bg-burnished-gold text-white px-4 py-2 text-sm uppercase tracking-widest hover:bg-burnished-gold/90 transition-colors"
                >
                  E
                </button>
              </div>
            </form>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 bg-warm-gray/20 flex items-center justify-center hover:bg-burnished-gold transition-colors">
                <span className="text-xs">f</span>
              </a>
              <a href="#" className="w-8 h-8 bg-warm-gray/20 flex items-center justify-center hover:bg-burnished-gold transition-colors">
                <span className="text-xs">t</span>
              </a>
              <a href="#" className="w-8 h-8 bg-warm-gray/20 flex items-center justify-center hover:bg-burnished-gold transition-colors">
                <span className="text-xs">i</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-warm-gray/20 pt-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-burnished-gold rounded-sm flex items-center justify-center">
              <span className="text-xs font-serif text-charcoal">A</span>
            </div>
            <span className="text-xs text-warm-gray">ArtsyGhana</span>
          </div>
          <div className="text-xs text-warm-gray">
            © 2023 ArtsyGhana. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
