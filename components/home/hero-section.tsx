'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Gallery3D from '@/components/Gallery3D'

export function HeroSection() {
    const [showExhibition, setShowExhibition] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const heroRef = useRef<HTMLDivElement>(null)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [animationComplete, setAnimationComplete] = useState(false)
    const scrollAccumulator = useRef(0)

    // Scroll-controlled video scrubbing with page lock AND smooth interpolation
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const SCROLL_MULTIPLIER = 4
        const LERP_FACTOR = 0.05

        let currentSmoothedProgress = animationComplete ? 1 : 0
        let rafId: number

        const renderLoop = () => {
            const maxScroll = window.innerHeight * SCROLL_MULTIPLIER
            const targetProgress = Math.max(0, Math.min(1, scrollAccumulator.current / maxScroll))

            currentSmoothedProgress += (targetProgress - currentSmoothedProgress) * LERP_FACTOR

            const videoDuration = video.duration
            if (videoDuration && !isNaN(videoDuration)) {
                if (Math.abs(targetProgress - currentSmoothedProgress) < 0.001) {
                    currentSmoothedProgress = targetProgress
                }
                video.currentTime = currentSmoothedProgress * videoDuration
            }

            setScrollProgress(currentSmoothedProgress)

            if (!animationComplete && currentSmoothedProgress >= 0.99) {
                setAnimationComplete(true)
                scrollAccumulator.current = maxScroll
            }

            rafId = requestAnimationFrame(renderLoop)
        }

        rafId = requestAnimationFrame(renderLoop)

        const handleWheel = (e: WheelEvent) => {
            const maxScroll = window.innerHeight * SCROLL_MULTIPLIER

            if (!animationComplete) {
                e.preventDefault()
                scrollAccumulator.current += e.deltaY * 0.5
                scrollAccumulator.current = Math.max(0, Math.min(scrollAccumulator.current, maxScroll))
            } else {
                if (window.scrollY <= 5 && e.deltaY < 0) {
                    e.preventDefault()
                    setAnimationComplete(false)
                    scrollAccumulator.current = maxScroll - 1
                }
            }
        }

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0]
            ; (video as any).touchStartY = touch.clientY
        }

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0]
            const touchStartY = (video as any).touchStartY || touch.clientY
            const deltaY = touchStartY - touch.clientY
            ; (video as any).touchStartY = touch.clientY

            const maxScroll = window.innerHeight * SCROLL_MULTIPLIER

            if (!animationComplete) {
                e.preventDefault()
                scrollAccumulator.current += deltaY * 1.5
                scrollAccumulator.current = Math.max(0, Math.min(scrollAccumulator.current, maxScroll))
            } else {
                if (window.scrollY <= 5 && deltaY < 0) {
                    e.preventDefault()
                    setAnimationComplete(false)
                    scrollAccumulator.current = maxScroll - 1
                }
            }
        }

        window.addEventListener('wheel', handleWheel, { passive: false })
        window.addEventListener('touchstart', handleTouchStart, { passive: false })
        window.addEventListener('touchmove', handleTouchMove, { passive: false })

        return () => {
            cancelAnimationFrame(rafId)
            window.removeEventListener('wheel', handleWheel)
            window.removeEventListener('touchstart', handleTouchStart)
            window.removeEventListener('touchmove', handleTouchMove)
        }
    }, [animationComplete])

    // Lock body scroll until animation completes
    useEffect(() => {
        if (!animationComplete) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [animationComplete])

    if (showExhibition) {
        return (
            <div className="relative h-screen w-full bg-luxury-cream">
                <button
                    onClick={() => setShowExhibition(false)}
                    className="absolute top-8 left-8 z-[100] border border-luxury-black px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-luxury-black hover:text-white transition-all duration-500 glass"
                >
                    ← Exit Exhibition
                </button>
                <Suspense fallback={
                    <div className="h-screen w-full flex items-center justify-center bg-luxury-cream">
                        <div className="text-luxury-gold animate-pulse text-sm uppercase tracking-widest">
                            Initializing virtual gallery...
                        </div>
                    </div>
                }>
                    <Gallery3D />
                </Suspense>
            </div>
        )
    }

    return (
        <section ref={heroRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_bc4CpodFOdV6pWpJUiFtw36WhT45/1bnxPMjzv9R2hlHZDhe9dp/public/images/artsyghana_hero_optimized.mp4"
                    muted
                    playsInline
                    preload="auto"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
            </div>

            <div className="relative z-10 text-center max-w-5xl px-8">
                <p className="text-luxury-gold text-xs uppercase tracking-[0.4em] mb-6 font-semibold animate-fade-in drop-shadow-lg">
                    EST. 2024 • ACCRA, GHANA
                </p>
                <h1 className="text-7xl md:text-9xl font-serif text-white mb-8 leading-tight tracking-tighter drop-shadow-2xl">
                    Where heritage <br />
                    <span className="italic">meets</span> innovation.
                </h1>
                <p className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed drop-shadow-lg">
                    A curated digital sanctuary for contemporary Ghanaian art.
                    Experience the soul of West African creativity through an immersive virtual lens.
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                    <button
                        onClick={() => setShowExhibition(true)}
                        className="group relative bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-5 text-xs uppercase tracking-[0.25em] overflow-hidden transition-all duration-500 hover:bg-luxury-gold hover:border-luxury-gold"
                    >
                        <span className="relative z-10">Enter Exhibition</span>
                    </button>
                    <a href="/store" className="text-xs uppercase tracking-[0.25em] border-b border-white/60 pb-1 hover:text-luxury-gold hover:border-luxury-gold transition-all duration-300 text-white drop-shadow-lg">
                        Browse Collections
                    </a>
                </div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                <span className="text-[10px] uppercase tracking-widest text-white/80 mb-4 drop-shadow-lg">Scroll to Explore</span>
                <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
            </div>
        </section>
    )
}
