import { useState, useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    wrapperClassName?: string;
    priority?: boolean; // Set true for above-the-fold images
}

/**
 * Optimized image component with:
 * - Native lazy loading
 * - Intersection Observer for better control
 * - Fade-in animation on load
 * - Placeholder while loading
 */
export function OptimizedImage({
    src,
    alt,
    className = '',
    wrapperClassName = '',
    priority = false,
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (priority) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' } // Start loading 100px before in view
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [priority]);

    return (
        <div
            ref={imgRef}
            className={cn('relative overflow-hidden bg-surface', wrapperClassName)}
        >
            {/* Placeholder skeleton */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gradient-to-r from-surface via-border/20 to-surface animate-pulse" />
            )}

            {/* Actual image */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    onLoad={() => setIsLoaded(true)}
                    className={cn(
                        'transition-opacity duration-300',
                        isLoaded ? 'opacity-100' : 'opacity-0',
                        className
                    )}
                />
            )}
        </div>
    );
}
