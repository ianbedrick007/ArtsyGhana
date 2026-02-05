'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        console.log('🔵 Form submitted')
        console.log('Email:', email)
        console.log('Password length:', password.length)

        setError('')
        setIsLoading(true)

        try {
            console.log('🔵 Calling signIn...')
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            console.log('🔵 SignIn result:', result)

            if (result?.error) {
                console.error('❌ Login error:', result.error)
                // Show user-friendly error message
                setError('Invalid email or password. Please try again.')
            } else if (result?.ok) {
                console.log('✅ Login successful! Redirecting...')
                router.push('/admin')
                router.refresh()
            } else {
                console.warn('⚠️ Unexpected result:', result)
                setError('Login failed. Please check your credentials.')
            }
        } catch (error) {
            console.error('❌ Exception during login:', error)
            setError('An error occurred during login. Please try again.')
        } finally {
            console.log('🔵 Setting loading to false')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-dark-white flex items-center justify-center px-4 sm:px-6 md:px-8">
            <div className="w-full max-w-md">
                {/* Glass Card */}
                <div className="glass rounded-lg p-8 sm:p-10 md:p-12 shadow-2xl">
                    {/* Logo/Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-serif text-charcoal mb-2">
                            Admin Portal
                        </h1>
                        <p className="text-warm-gray text-sm uppercase tracking-widest">
                            ArtsyGhana Dashboard
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-charcoal font-medium">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="bg-white/50 border-warm-gray/30 focus:border-burnished-gold focus:ring-burnished-gold"
                                placeholder="admin@artsyghana.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-charcoal font-medium">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="bg-white/50 border-warm-gray/30 focus:border-burnished-gold focus:ring-burnished-gold"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-charcoal text-white hover:bg-charcoal/90 text-xs uppercase tracking-widest font-medium h-12"
                        >
                            {isLoading ? '⏳ Signing in...' : 'Sign In'}
                        </Button>
                    </div>

                    {/* Signup Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-warm-gray">
                            Don't have an account?{' '}
                            <Link
                                href="/admin/signup"
                                className="text-burnished-gold hover:text-bronze font-medium transition-colors"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="mt-8 pt-6 border-t border-warm-gray/20">
                        <Link
                            href="/"
                            className="text-xs text-warm-gray hover:text-charcoal transition-colors uppercase tracking-widest block text-center"
                        >
                            ← Back to Main Site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
