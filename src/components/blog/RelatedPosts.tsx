import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { formatDate } from '../../utils/blogUtils';
import type { BlogPost } from '../../types';

interface RelatedPostsProps {
    posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
    if (posts.length === 0) return null;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <motion.aside
            className="sticky top-24"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="p-4 rounded-xl bg-surface/50 border border-border backdrop-blur-sm">
                <h4 className="text-sm font-semibold text-text-primary mb-4">
                    Related Posts
                </h4>
                <div className="space-y-4">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <Link
                                to={`/blog/${post.slug}`}
                                onClick={scrollToTop}
                                className="group block p-3 -mx-1 rounded-lg hover:bg-primary/5 transition-colors"
                            >
                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {post.tags.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-primary/10 text-primary"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Title */}
                                <h5 className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                    {post.title}
                                </h5>

                                {/* Meta */}
                                <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                                    <span>{formatDate(post.publishedAt)}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={10} />
                                        {post.readingTime} min
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.aside>
    );
}
