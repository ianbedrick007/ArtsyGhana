'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Gallery3D from '@/components/Gallery3D'

export function HeroSection() {
    const [showExhibition, setShowExhibition] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const heroRef = useRef<HTMLDivElement>(null)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [animationComplete, setAnimationComplete] = useState(false)
    const [videoLoaded, setVideoLoaded] = useState(false)
    const scrollAccumulator = useRef(0)

    // Initialize video on load - critical for mobile
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleLoadedMetadata = () => {
            setVideoLoaded(true)
            // Try to play and immediately pause to enable scrubbing on mobile
            video.play().then(() => {
                video.pause()
                video.currentTime = 0
            }).catch(err => {
                console.log('Video autoplay prevented:', err)
                // On mobile, we might need user interaction first
                setVideoLoaded(true)
            })
        }

        const handleCanPlay = () => {
            setVideoLoaded(true)
        }

        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        video.addEventListener('canplay', handleCanPlay)

        // Force load
        video.load()

        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata)
            video.removeEventListener('canplay', handleCanPlay)
        }
    }, [])

    // Scroll-controlled video scrubbing with page lock AND smooth interpolation
    useEffect(() => {
        const video = videoRef.current
        if (!video || !videoLoaded) return

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
    }, [animationComplete, videoLoaded])

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
            <div className="relative h-screen w-full bg-dark-white">
                <button
                    onClick={() => setShowExhibition(false)}
                    className="absolute top-8 left-8 z-[100] border border-charcoal px-6 py-2 text-[10px] uppercase tracking-widest hover:bg-charcoal hover:text-white transition-all duration-500 glass"
                >
                    ← Exit Exhibition
                </button>
                <Suspense fallback={
                    <div className="h-screen w-full flex items-center justify-center bg-dark-white">
                        <div className="text-burnished-gold animate-pulse text-sm uppercase tracking-widest">
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
        <section ref={heroRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-dark-white">
            {/* Loading Overlay */}
            {!videoLoaded && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-dark-white">
                    <div className="text-burnished-gold animate-pulse text-sm uppercase tracking-widest">
                        Loading experience...
                    </div>
                </div>
            )}

            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_bc4CpodFOdV6pWpJUiFtw36WhT45/1bnxPMjzv9R2hlHZDhe9dp/public/images/artsyghana_hero_optimized.mp4"
                    muted
                    playsInline
                    preload="auto"
                    webkit-playsinline="true"
                    x5-playsinline="true"
                />
            </div>

            {/* Abstract Golden Geometric Shapes - Hidden on mobile for performance */}
            <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
                {/* Golden sphere at top */}
                <div className="absolute top-20 right-1/4 w-32 h-32 bg-burnished-gold/20 rounded-full blur-3xl" />
                {/* Tall rectangular pillar */}
                <div className="absolute top-1/4 left-1/3 w-16 h-96 bg-burnished-gold/15 blur-2xl transform -rotate-12" />
                {/* Smaller rectangular base */}
                <div className="absolute bottom-1/4 right-1/3 w-48 h-24 bg-burnished-gold/20 blur-2xl transform rotate-6" />
                {/* Square shape */}
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-burnished-gold/15 blur-xl transform rotate-45" />
                {/* Octagon-like shape */}
                <div className="absolute bottom-1/3 left-1/2 w-20 h-20 bg-burnished-gold/20 blur-2xl transform rotate-12" />
                {/* Curved line */}
                <div className="absolute top-1/3 right-1/5 w-64 h-2 bg-burnished-gold/15 blur-xl transform rotate-45 rounded-full" />
            </div>

            <div className="relative z-10 text-center max-w-5xl px-4 sm:px-6 md:px-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-serif text-white mb-4 sm:mb-6 leading-tight tracking-tight drop-shadow-2xl">
                    Bring Art into Your Space.
                </h1>
                <div className="flex justify-center items-center mt-8 sm:mt-10 md:mt-12">
                    <button
                        onClick={() => setShowExhibition(true)}
                        className="bg-charcoal text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 text-xs sm:text-sm uppercase tracking-widest font-medium hover:bg-charcoal/90 transition-colors"
                    >
                        EXPLORE THE VIRTUAL GALLERY
                    </button>
                </div>
            </div>

            <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
                <div className="w-[1px] h-6 sm:h-8 bg-warm-gray mb-2" />
                <span className="text-[10px] uppercase tracking-widest text-warm-gray">SCROLL</span>
            </div>
        </section>
    )
}
