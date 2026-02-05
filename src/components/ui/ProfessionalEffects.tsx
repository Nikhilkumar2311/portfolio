import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterProps {
    words: string[];
    className?: string;
    typingSpeed?: number;
    deletingSpeed?: number;
    delayBetweenWords?: number;
}

/**
 * Professional typewriter effect - cycles through words
 */
export function Typewriter({
    words,
    className = "",
    typingSpeed = 100,
    deletingSpeed = 50,
    delayBetweenWords = 2000,
}: TypewriterProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentWord = words[currentWordIndex];

        const timeout = setTimeout(
            () => {
                if (!isDeleting) {
                    // Typing
                    if (currentText.length < currentWord.length) {
                        setCurrentText(currentWord.slice(0, currentText.length + 1));
                    } else {
                        // Finished typing, wait then start deleting
                        setTimeout(() => setIsDeleting(true), delayBetweenWords);
                    }
                } else {
                    // Deleting
                    if (currentText.length > 0) {
                        setCurrentText(currentText.slice(0, -1));
                    } else {
                        // Finished deleting, move to next word
                        setIsDeleting(false);
                        setCurrentWordIndex((prev) => (prev + 1) % words.length);
                    }
                }
            },
            isDeleting ? deletingSpeed : typingSpeed
        );

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords]);

    return (
        <span className={className}>
            {currentText}
            <motion.span
                className="inline-block w-0.5 h-[1em] bg-primary ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            />
        </span>
    );
}

interface CounterProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

/**
 * Animated counter that counts up when in view
 */
export function Counter({
    end,
    duration = 2,
    suffix = "",
    prefix = "",
    className = "",
}: CounterProps) {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            onViewportEnter={() => {
                if (hasAnimated) return;
                setHasAnimated(true);

                const startTime = Date.now();
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / (duration * 1000), 1);

                    // Ease out cubic
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(easeOut * end));

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        setCount(end);
                    }
                };
                requestAnimationFrame(animate);
            }}
        >
            {prefix}{count}{suffix}
        </motion.span>
    );
}

interface BackToTopProps {
    showAfter?: number;
}

/**
 * Back to top button with smooth scroll
 */
export function BackToTop({ showAfter = 400 }: BackToTopProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > showAfter);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [showAfter]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-hover transition-colors"
                    onClick={scrollToTop}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Back to top"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </motion.button>
            )}
        </AnimatePresence>
    );
}

/**
 * Subtle animated dot grid for backgrounds
 */
export function DotGrid({ className = "" }: { className?: string }) {
    return (
        <div
            className={`absolute inset-0 pointer-events-none opacity-30 ${className}`}
            style={{
                backgroundImage: `radial-gradient(circle, var(--color-text-secondary) 1px, transparent 1px)`,
                backgroundSize: "32px 32px",
            }}
        />
    );
}
