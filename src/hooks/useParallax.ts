import { useRef } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

interface UseParallaxOptions {
    /** Speed of parallax effect. Positive = move up, Negative = move down */
    speed?: number;
    /** Scroll offset range [start, end] */
    offset?: ["start" | "center" | "end", "start" | "center" | "end"];
}

interface ParallaxResult {
    ref: React.RefObject<HTMLDivElement>;
    y: MotionValue<number>;
    opacity: MotionValue<number>;
    scale: MotionValue<number>;
}

/**
 * Custom hook for parallax effects using Framer Motion
 * @param options - Configuration for parallax behavior
 * @returns ref to attach to container and motion values for transforms
 */
export function useParallax(options: UseParallaxOptions = {}): ParallaxResult {
    const { speed = 50, offset = ["start", "end"] } = options;
    const ref = useRef<HTMLDivElement>(null!);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: [`${offset[0]} end`, `${offset[1]} start`],
    });

    // Parallax Y movement
    const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

    // Fade in/out effect
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

    // Subtle scale effect
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

    return { ref, y, opacity, scale };
}

/**
 * Simpler parallax hook for background elements
 */
export function useBackgroundParallax(speed: number = 0.5) {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, (value) => value * speed);
    return y;
}
