'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminSignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        console.log('🔵 Signup form submitted')
        console.log('Form data:', { name: formData.name, email: formData.email, passwordLength: formData.password.length })

        setError('')

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setIsLoading(true)

        try {
            console.log('🔵 Sending POST request to /api/admin/auth/signup')
            const response = await fetch('/api/admin/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            console.log('🔵 Response status:', response.status)
            const data = await response.json()
            console.log('🔵 Response data:', data)

            if (!response.ok) {
                setError(data.error || 'An error occurred during signup')
            } else {
                console.log('✅ Signup successful! Redirecting to login...')
                // Redirect to login page on success
                router.push('/admin/login?signup=success')
            }
        } catch (error) {
            console.error('❌ Signup error:', error)
            setError('An error occurred during signup')
        } finally {
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
                            Create Admin Account
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

                    {/* Signup Form */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-charcoal font-medium">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className="bg-white/50 border-warm-gray/30 focus:border-burnished-gold focus:ring-burnished-gold"
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-charcoal font-medium">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                                className="bg-white/50 border-warm-gray/30 focus:border-burnished-gold focus:ring-burnished-gold"
                                placeholder="••••••••"
                            />
                            <p className="text-xs text-warm-gray mt-1">
                                Minimum 8 characters
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-charcoal font-medium">
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
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
                            {isLoading ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </div>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-warm-gray">
                            Already have an account?{' '}
                            <Link
                                href="/admin/login"
                                className="text-burnished-gold hover:text-bronze font-medium transition-colors"
                            >
                                Sign in
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
