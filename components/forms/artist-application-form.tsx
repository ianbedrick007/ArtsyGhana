'use client'

import { useState } from 'react'
import { submitArtistApplication } from '@/app/actions/artists'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function ArtistApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      bio: formData.get('bio') as string,
      statement: formData.get('statement') as string,
      instagramHandle: formData.get('instagramHandle') as string,
      website: formData.get('website') as string,
      portfolioUrl: formData.get('portfolioUrl') as string,
    }

    const result = await submitArtistApplication(data)

    if (result.success) {
      setSuccess(true)
      e.currentTarget.reset()
    } else {
      setError(result.error || 'Failed to submit application')
    }

    setIsSubmitting(false)
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="text-luxury-gold text-5xl mb-4">✓</div>
        <h3 className="text-2xl font-serif text-luxury-black mb-4">Application Submitted!</h3>
        <p className="text-luxury-gray mb-6">
          Thank you for your interest in collaborating with ArtsyGhana. 
          We'll review your application and get back to you within 5-7 business days.
        </p>
        <Button
          onClick={() => setSuccess(false)}
          variant="outline"
          className="uppercase tracking-widest"
        >
          Submit Another Application
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Your full name"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your.email@example.com"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+233 XX XXX XXXX"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagramHandle">Instagram Handle</Label>
          <Input
            id="instagramHandle"
            name="instagramHandle"
            placeholder="@yourhandle"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://yourwebsite.com"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolioUrl">Portfolio URL</Label>
          <Input
            id="portfolioUrl"
            name="portfolioUrl"
            type="url"
            placeholder="https://portfolio.com"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Artist Bio * (50-1000 characters)</Label>
        <Textarea
          id="bio"
          name="bio"
          required
          rows={4}
          placeholder="Tell us about yourself, your background, and your artistic journey..."
          disabled={isSubmitting}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="statement">Artist Statement * (100-2000 characters)</Label>
        <Textarea
          id="statement"
          name="statement"
          required
          rows={6}
          placeholder="Describe your artistic vision, themes you explore, and what drives your creative practice..."
          disabled={isSubmitting}
          className="resize-none"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full uppercase tracking-widest"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>

      <p className="text-xs text-luxury-gray text-center">
        By submitting this form, you agree to our terms and conditions and 
        acknowledge that your information will be reviewed by our curatorial team.
      </p>
    </form>
  )
}
