'use client'

import { useCart } from '@/store/useCart'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Dynamically import PaystackButton to avoid SSR window error
const PaystackButton = dynamic(
    () => import('react-paystack').then((mod) => mod.PaystackButton),
    { ssr: false }
)

export default function CartPage() {
    const { items, total, removeItem, clearCart } = useCart()
    const [email, setEmail] = useState('')
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const config = {
        reference: (new Date()).getTime().toString(),
        email: email || 'customer@example.com',
        amount: total() * 100, // Paystack amount is in kobo/pesewas
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        currency: 'GHS',
    }

    const handlePaystackSuccessAction = async (reference: any) => {
        // Verify on backend
        const res = await fetch('/api/paystack/verify', {
            method: 'POST',
            body: JSON.stringify({ reference: reference.reference }),
        })

        if (res.ok) {
            alert('Payment successful!')
            clearCart()
        }
    }

    const handlePaystackCloseAction = () => {
        console.log('Payment closed by user')
    }

    return (
        <div className="pt-32 pb-24 px-8 max-w-4xl mx-auto min-h-screen">
            <h1 className="text-4xl font-serif mb-12">Your Collection</h1>

            {items.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-luxury-gray text-lg mb-8 uppercase tracking-widest">Your cart is currently empty</p>
                    <a href="/" className="text-luxury-gold uppercase tracking-[0.2em] border-b border-luxury-gold pb-1 text-xs">
                        Begin Exploring
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-8">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-6 pb-8 border-b border-gray-200">
                                <div className="w-24 h-24 bg-luxury-cream border border-gray-100 flex-shrink-0" />
                                <div className="flex-grow">
                                    <h3 className="text-lg font-serif mb-1">{item.name}</h3>
                                    <p className="text-luxury-gray text-sm mb-4">GHS {item.price.toLocaleString()}</p>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className="text-luxury-black font-medium">
                                    {item.quantity}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-8 border border-gray-100 h-fit sticky top-32">
                        <h2 className="text-xl font-serif mb-6">Summary</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-luxury-gray">Subtotal</span>
                                <span>GHS {total().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-4 border-t">
                                <span>Total</span>
                                <span>GHS {total().toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-luxury-gold transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <PaystackButton
                                {...config}
                                text="Proceed to Checkout"
                                onSuccess={handlePaystackSuccessAction}
                                onClose={handlePaystackCloseAction}
                                className="w-full bg-luxury-black text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-luxury-gold transition-all duration-300 disabled:opacity-50"
                            />
                        </div>

                        <p className="text-[10px] mt-6 text-center text-luxury-gray uppercase tracking-widest">
                            Secure checkout via Paystack
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
