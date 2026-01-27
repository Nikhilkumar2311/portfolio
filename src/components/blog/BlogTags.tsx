import { motion } from 'framer-motion';

interface BlogTagsProps {
    tags: string[];
    selectedTag: string | null;
    onSelectTag: (tag: string | null) => void;
}

export function BlogTags({ tags, selectedTag, onSelectTag }: BlogTagsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTag === null
                        ? 'bg-primary text-white'
                        : 'bg-surface border border-border text-text-secondary hover:border-primary/50 hover:text-text-primary'
                    }`}
            >
                All
            </motion.button>
            {tags.map((tag, index) => (
                <motion.button
                    key={tag}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectTag(tag === selectedTag ? null : tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTag === tag
                            ? 'bg-primary text-white'
                            : 'bg-surface border border-border text-text-secondary hover:border-primary/50 hover:text-text-primary'
                        }`}
                >
                    {tag}
                </motion.button>
            ))}
        </div>
    );
}
