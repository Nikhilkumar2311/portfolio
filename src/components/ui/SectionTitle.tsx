import { motion } from 'framer-motion';

interface SectionTitleProps {
    title: string;
    subtitle?: string;
    className?: string;
}

export function SectionTitle({ title, subtitle, className = '' }: SectionTitleProps) {
    return (
        <motion.div
            className={`text-center mb-12 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-text-secondary max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}
