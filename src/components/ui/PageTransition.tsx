import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { type ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

/**
 * Wraps pages with smooth fade transition
 */
export function PageTransition({ children }: PageTransitionProps) {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                    duration: 0.3,
                    ease: [0.25, 0.4, 0.25, 1],
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
