import { ArtistApplicationForm } from '@/components/forms/artist-application-form'

export default function CollaboratePage() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-luxury-gold text-xs uppercase tracking-[0.3em] mb-4">Join Our Community</p>
          <h1 className="text-5xl md:text-6xl font-serif text-luxury-black mb-8">Collaborate With Us</h1>
          <div className="w-[1px] h-12 bg-luxury-gold mx-auto mb-8" />
          <p className="text-lg text-luxury-gray leading-relaxed max-w-2xl mx-auto">
            Are you a Ghanaian artist looking to showcase your work to a global audience? 
            Submit your application below and join our curated community of talented creators.
          </p>
        </div>

        {/* Application Form */}
        <div className="bg-luxury-cream p-8 md:p-12">
          <h2 className="text-2xl font-serif text-luxury-black mb-6">Artist Application</h2>
          <ArtistApplicationForm />
        </div>

        {/* Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-serif text-luxury-black mb-3">Global Reach</h3>
            <p className="text-sm text-luxury-gray">
              Showcase your work to collectors and art enthusiasts worldwide through our platform.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-serif text-luxury-black mb-3">Virtual Galleries</h3>
            <p className="text-sm text-luxury-gray">
              Experience your art in immersive 3D exhibition spaces that bring your work to life.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-serif text-luxury-black mb-3">Fair Commission</h3>
            <p className="text-sm text-luxury-gray">
              Keep more of what you earn with our artist-friendly commission structure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
