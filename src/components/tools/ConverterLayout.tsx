import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PrivacyBanner } from './PrivacyBanner';
import { SEOHead } from '../SEOHead';

interface ConverterLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  /** Use wider layout for side-by-side editors */
  wide?: boolean;
}

export function ConverterLayout({ title, description, children, wide }: ConverterLayoutProps) {
  return (
    <>
      <SEOHead
        title={title}
        description={description}
        canonicalUrl={`/tools`}
      />

      <section className="min-h-screen py-20 md:py-32">
        <div className={`${wide ? 'max-w-6xl' : 'max-w-3xl'} mx-auto px-4 sm:px-6 lg:px-8`}>
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size={16} />
              Back to Tools
            </Link>
          </motion.div>

          {/* Title */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              {title}
            </h1>
            <p className="text-text-secondary">{description}</p>
          </motion.div>

          {/* Privacy */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <PrivacyBanner />
          </motion.div>

          {/* Tool content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {children}
          </motion.div>
        </div>
      </section>
    </>
  );
}
