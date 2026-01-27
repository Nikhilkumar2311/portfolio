import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(content: string): TOCItem[] {
    const headingRegex = /^(#{2,4})\s+(.+)$/gm;
    const headings: TOCItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length; // Number of # symbols
        const text = match[2].trim();
        const id = text
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');

        headings.push({ id, text, level });
    }

    return headings;
}

export function TableOfContents({ content }: TableOfContentsProps) {
    const [activeId, setActiveId] = useState<string>('');
    const headings = useMemo(() => extractHeadings(content), [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-80px 0px -80% 0px',
                threshold: 0,
            }
        );

        // Observe all heading elements
        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Account for fixed header
            const y = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    if (headings.length === 0) return null;

    return (
        <motion.nav
            className="sticky top-24"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="p-4 rounded-xl bg-surface/50 border border-border backdrop-blur-sm">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-4">
                    <List size={16} className="text-primary" />
                    On This Page
                </h4>
                <ul className="space-y-2">
                    {headings.map((heading) => (
                        <li
                            key={heading.id}
                            style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
                        >
                            <button
                                onClick={() => scrollToHeading(heading.id)}
                                className={`text-left text-sm transition-all duration-200 hover:text-primary w-full truncate ${activeId === heading.id
                                        ? 'text-primary font-medium'
                                        : 'text-text-secondary'
                                    }`}
                            >
                                {heading.text}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.nav>
    );
}
