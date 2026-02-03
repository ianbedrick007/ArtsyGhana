import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark-white">
      {/* Hero Banner */}
      <section className="bg-[#8D6B3B] text-white py-24 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">About ArtsyGhana</h1>
          <p className="text-lg text-warm-gray">
            Celebrating Ghanaian creativity through curated art experiences.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 px-8 bg-dark-white">
        <div className="max-w-7xl mx-auto">
          <div className="w-16 h-px bg-warm-gray mb-8 mx-auto" />
          <h2 className="text-4xl font-serif text-charcoal text-center mb-12">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-warm-gray leading-relaxed mb-4">
                ArtsyGhana was born from a vision to bridge the gap between Ghana's vibrant artistic heritage and the global art community. We are more than a gallery—we are a platform that amplifies the voices of Ghanaian artists.
              </p>
              <p className="text-warm-gray leading-relaxed mb-4">
                Our curated collection represents the diversity and richness of contemporary Ghanaian art, from traditional craftsmanship to bold modern expressions. Each piece tells a story, carries cultural significance, and represents the exceptional talent of our artists.
              </p>
              <p className="text-warm-gray leading-relaxed">
                Through our platform, we provide artists with the visibility they deserve while offering collectors access to authentic, high-quality artwork that celebrates African creativity.
              </p>
            </div>
            <div className="relative aspect-[4/5] bg-light-grey flex items-center justify-center">
              <div className="text-center p-8">
                <h3 className="text-2xl font-serif text-charcoal mb-4">Ghanaian Art</h3>
                <div className="w-32 h-32 mx-auto bg-burnished-gold/20 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-24 px-8 bg-dark-white">
        <div className="max-w-7xl mx-auto">
          <div className="w-16 h-px bg-warm-gray mb-8 mx-auto" />
          <h2 className="text-4xl font-serif text-charcoal text-center mb-4">Our Mission & Values</h2>
          <div className="w-16 h-px bg-warm-gray mt-8 mb-16 mx-auto" />
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-2xl font-serif text-charcoal mb-4">Authenticity</h3>
              <p className="text-warm-gray leading-relaxed">
                Every piece in our collection is carefully vetted to ensure its authenticity and quality, representing genuine Ghanaian artistic expression.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-serif text-charcoal mb-4">Artist Empowerment</h3>
              <p className="text-warm-gray leading-relaxed">
                We provide fair compensation and global exposure to our artists, supporting their creative journeys and livelihoods.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-serif text-charcoal mb-4">Cultural Heritage</h3>
              <p className="text-warm-gray leading-relaxed">
                We preserve and promote Ghana's rich artistic traditions while embracing contemporary innovation and expression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get In Touch */}
      <section className="bg-[#8D6B3B] text-white py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif text-center mb-16">Get In Touch</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <MapPin className="w-6 h-6 mx-auto mb-4 text-burnished-gold" />
              <h3 className="text-lg font-medium mb-2">Visit Us</h3>
              <p className="text-warm-gray text-sm">
                ArtsyGhana Centre, Kanda, Accra, Ghana.
              </p>
            </div>
            <div className="text-center">
              <Phone className="w-6 h-6 mx-auto mb-4 text-burnished-gold" />
              <h3 className="text-lg font-medium mb-2">Call Us</h3>
              <p className="text-warm-gray text-sm">
                +233 (0) XX XXX XXXX
                <br />
                Mon - Fri: 9am - 5pm
                <br />
                Sat: 10am - 4pm
              </p>
            </div>
            <div className="text-center">
              <Mail className="w-6 h-6 mx-auto mb-4 text-burnished-gold" />
              <h3 className="text-lg font-medium mb-2">Email Us</h3>
              <p className="text-warm-gray text-sm">
                collaborate@artsyghana.com
                <br />
                support@artsyghana.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Let's Collaborate */}
      <section className="py-24 px-8 bg-dark-white">
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-px bg-warm-gray mb-8 mx-auto" />
          <h2 className="text-4xl font-serif text-charcoal text-center mb-4">Let's Collaborate</h2>
          <p className="text-warm-gray text-center mb-12 max-w-2xl mx-auto">
            Whether you're an artist, gallery, or institution, we'd love to explore partnership opportunities with you.
          </p>
          <form className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="text-sm uppercase tracking-widest text-charcoal mb-2 block">
                FULL NAME *
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                className="bg-dark-white border-charcoal/20"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm uppercase tracking-widest text-charcoal mb-2 block">
                EMAIL ADDRESS *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="bg-dark-white border-charcoal/20"
                required
              />
            </div>
            <div>
              <Label htmlFor="company" className="text-sm uppercase tracking-widest text-charcoal mb-2 block">
                COMPANY/ORGANIZATION
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Your company name"
                className="bg-dark-white border-charcoal/20"
              />
            </div>
            <div>
              <Label htmlFor="collaboration" className="text-sm uppercase tracking-widest text-charcoal mb-2 block">
                TYPE OF COLLABORATION *
              </Label>
              <Select defaultValue="gallery">
                <SelectTrigger className="bg-dark-white border-charcoal/20">
                  <SelectValue placeholder="Select collaboration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gallery">Gallery Partnership</SelectItem>
                  <SelectItem value="artist">Artist Collaboration</SelectItem>
                  <SelectItem value="institution">Institutional Partnership</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message" className="text-sm uppercase tracking-widest text-charcoal mb-2 block">
                MESSAGE *
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us about your collaboration idea..."
                className="bg-dark-white border-charcoal/20 min-h-32"
                required
              />
            </div>
            <div className="flex justify-center">
              <Button type="submit" variant="accent" className="px-12">
                <span className="mr-2">Send Message</span>
                <span>✈</span>
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
