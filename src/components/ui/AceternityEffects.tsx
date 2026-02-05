import { type ReactNode, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "../../lib/utils";

interface SpotlightCardProps {
    children: ReactNode;
    className?: string;
    spotlightColor?: string;
}

/**
 * Aceternity-style spotlight card with mouse-follow gradient
 */
export function SpotlightCard({
    children,
    className,
    spotlightColor = "rgba(99, 102, 241, 0.15)",
}: SpotlightCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            className={cn(
                "relative overflow-hidden rounded-2xl border border-border bg-surface p-6",
                "group transition-colors hover:border-primary/50",
                className
            )}
        >
            {/* Spotlight gradient that follows mouse */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
                }}
            />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
}

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    tiltAmount?: number;
}

/**
 * 3D Tilt card effect on hover
 */
export function TiltCard({ children, className, tiltAmount = 10 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);

    const springConfig = { stiffness: 150, damping: 15 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        rotateX.set((mouseY / (rect.height / 2)) * -tiltAmount);
        rotateY.set((mouseX / (rect.width / 2)) * tiltAmount);
    };

    const handleMouseLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: "preserve-3d",
            }}
            className={cn("relative", className)}
        >
            {children}
        </motion.div>
    );
}

interface GlowingBorderProps {
    children: ReactNode;
    className?: string;
    gradientColors?: string;
}

/**
 * Animated glowing border effect
 */
export function GlowingBorder({
    children,
    className,
    gradientColors = "from-primary via-secondary to-primary",
}: GlowingBorderProps) {
    return (
        <div className={cn("relative p-[2px] rounded-2xl overflow-hidden group", className)}>
            {/* Animated gradient border */}
            <div
                className={cn(
                    "absolute inset-0 rounded-2xl bg-gradient-to-r",
                    gradientColors,
                    "opacity-60 group-hover:opacity-100 transition-opacity duration-300",
                    "animate-[spin_3s_linear_infinite]"
                )}
                style={{
                    backgroundSize: "200% 200%",
                    animation: "gradient-shift 3s ease infinite",
                }}
            />
            {/* Content container */}
            <div className="relative bg-surface rounded-2xl">{children}</div>
        </div>
    );
}

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
}

/**
 * Character-by-character text reveal animation
 */
export function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
    const words = text.split(" ");

    return (
        <motion.span className={cn("inline-flex flex-wrap", className)}>
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-flex mr-[0.25em]">
                    {word.split("").map((char, charIndex) => (
                        <motion.span
                            key={charIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: delay + wordIndex * 0.1 + charIndex * 0.03,
                                ease: [0.25, 0.4, 0.25, 1],
                            }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </span>
            ))}
        </motion.span>
    );
}
