import { notFound } from 'next/navigation'
import Image from 'next/image'
import blogData from '@/data/blog.json'

interface PageProps {
    params: {
        slug: string
    }
}

export default function BlogPost({ params }: PageProps) {
    const post = blogData.find((p) => p.slug === params.slug)

    if (!post) {
        notFound()
    }

    return (
        <article className="pt-32 pb-24 px-8 max-w-3xl mx-auto">
            <div className="mb-12 text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-luxury-gold mb-4 font-semibold">
                    {post.date}
                </div>
                <h1 className="text-4xl md:text-6xl font-serif text-luxury-black mb-8 leading-tight">
                    {post.title}
                </h1>
                <div className="w-20 h-1 bg-luxury-gold mx-auto" />
            </div>

            <div className="relative aspect-[16/9] mb-12 overflow-hidden bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center text-luxury-gray text-xs uppercase tracking-widest">
                    Feature Image Placeholder
                </div>
                {/* <Image 
          src={post.image} 
          alt={post.title} 
          fill 
          className="object-cover"
          priority
        /> */}
            </div>

            <div className="prose prose-lg prose-luxury mx-auto">
                <p className="text-xl text-luxury-gray leading-relaxed mb-8 italic">
                    {post.excerpt}
                </p>
                <div className="text-luxury-black leading-loose whitespace-pre-wrap">
                    {post.content}
                </div>
            </div>

            <div className="mt-20 pt-12 border-t border-luxury-gold flex justify-between items-center">
                <a href="/" className="text-xs uppercase tracking-widest hover:text-luxury-gold transition-colors flex items-center gap-2">
                    <span>←</span> Back to Gallery
                </a>
                <div className="flex gap-4">
                    {/* Social share icons would go here */}
                </div>
            </div>
        </article>
    )
}
