import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { formatDate } from '../../utils/blogUtils';
import type { BlogPost } from '../../types';

interface BlogCardProps {
    post: BlogPost;
    index?: number;
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link
                to={`/blog/${post.slug}`}
                className="group block h-full rounded-2xl border border-border bg-surface/50 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
                {/* Cover Image */}
                {post.coverImage && (
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Hide image on error
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                            >
                                {tag}
                            </span>
                        ))}
                        {post.tags.length > 3 && (
                            <span className="px-2.5 py-1 text-xs items-center font-medium rounded-full bg-border text-text-secondary">
                                +{post.tags.length - 3}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <span className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {formatDate(post.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {post.readingTime} min read
                        </span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
