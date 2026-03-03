import { useState, useEffect, useRef } from 'react'
import { SpaceTypesService } from '@/services/space-types.service'
import type { SpaceTypeWithImages } from '@/services/space-types.service'

// Auto-cycling image card — cycles through images every 3s
function SpaceTypeCard({ spaceType }: { spaceType: SpaceTypeWithImages }) {
    const images = spaceType.space_type_images
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((img) => img.image_url)

    const [activeIndex, setActiveIndex] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (images.length <= 1) return

        intervalRef.current = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % images.length)
        }, 3000)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [images.length])

    const hasImage = images.length > 0

    return (
        <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-surface ring-1 ring-muted/15 group">
            {/* Background images with crossfade */}
            {hasImage ? (
                images.map((url, i) => (
                    <div
                        key={url}
                        className="absolute inset-0 bg-center bg-cover transition-opacity duration-700"
                        style={{
                            backgroundImage: `url(${url})`,
                            opacity: i === activeIndex ? 1 : 0,
                        }}
                        aria-hidden="true"
                    />
                ))
            ) : (
                // Fallback: gradient placeholder
                <div
                    className="absolute inset-0 bg-linear-135 from-primary/20 to-primary/5"
                    aria-hidden="true"
                />
            )}

            {/* Dark gradient overlay */}
            <div
                className="absolute inset-0 bg-linear-0 from-black/60 via-black/20 to-transparent"
                aria-hidden="true"
            />

            {/* Image dot indicators */}
            {images.length > 1 && (
                <div className="absolute top-3 end-3 flex gap-1" aria-hidden="true">
                    {images.map((_, i) => (
                        <span
                            key={i}
                            className={`block rounded-full transition-all duration-500 ${
                                i === activeIndex
                                    ? 'w-4 h-1.5 bg-white'
                                    : 'w-1.5 h-1.5 bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* Space type name */}
            <div className="absolute bottom-0 inset-x-0 p-4">
                <p className="text-white font-semibold text-sm md:text-base drop-shadow-sm">
                    {spaceType.name}
                </p>
            </div>
        </div>
    )
}

// Skeleton card shown while loading
function SkeletonCard() {
    return (
        <div className="rounded-xl aspect-[4/3] bg-surface animate-pulse ring-1 ring-muted/15" />
    )
}

export default function SpaceTypesSection() {
    const [spaceTypes, setSpaceTypes] = useState<SpaceTypeWithImages[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        SpaceTypesService.getActive()
            .then(setSpaceTypes)
            .catch((err) => console.error('Failed to load space types:', err))
            .finally(() => setLoading(false))
    }, [])

    if (!loading && spaceTypes.length === 0) return null

    return (
        <div
            className={`grid gap-4 sm:gap-5 ${
                loading
                    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                    : spaceTypes.length <= 3
                    ? 'grid-cols-2 sm:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            }`}
        >
            {loading
                ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
                : spaceTypes.map((st) => <SpaceTypeCard key={st.id} spaceType={st} />)}
        </div>
    )
}
