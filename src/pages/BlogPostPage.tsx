import { useMemo, useEffect } from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { BlogContent, RelatedPosts, TableOfContents } from '../components/blog';
import { SEOHead } from '../components/SEOHead';
import { blogPosts } from '../data/blogs';
import { formatDate, getRelatedPosts } from '../utils/blogUtils';

export function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [location.pathname]);

    const post = useMemo(
        () => blogPosts.find((p) => p.slug === slug),
        [slug]
    );

    const relatedPosts = useMemo(
        () => (post ? getRelatedPosts(post, blogPosts, 3) : []),
        [post]
    );

    // Redirect to blog list if post not found
    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    return (
        <>
            <SEOHead
                title={post.title}
                description={post.excerpt}
                canonicalUrl={`/blog/${post.slug}`}
                ogImage={post.coverImage}
                ogType="article"
                publishedAt={post.publishedAt}
                updatedAt={post.updatedAt}
                tags={post.tags}
            />

            <div className="min-h-screen py-20 md:py-32">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Back to Blogs
                        </Link>
                    </motion.div>

                    {/* Three Column Layout - wider gaps and adjusted columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
                        {/* Left Sidebar - Table of Contents (hidden on mobile) */}
                        <aside className="hidden lg:block lg:col-span-2 xl:col-span-2">
                            <TableOfContents content={post.content} />
                        </aside>

                        {/* Main Content - wider center column */}
                        <article className="lg:col-span-7 xl:col-span-7">
                            {/* Header */}
                            <motion.header
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                                        >
                                            <Tag size={14} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
                                    {post.title}
                                </h1>

                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-4 text-text-secondary">
                                    <span className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        {formatDate(post.publishedAt)}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Clock size={16} />
                                        {post.readingTime} min read
                                    </span>
                                </div>
                            </motion.header>

                            {/* Cover Image */}
                            {post.coverImage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-10 rounded-2xl overflow-hidden border border-border"
                                >
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-auto object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </motion.div>
                            )}

                            {/* Mobile TOC */}
                            <div className="lg:hidden mb-8">
                                <TableOfContents content={post.content} />
                            </div>

                            {/* Content */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <BlogContent content={post.content} />
                            </motion.div>

                            {/* Mobile Related Posts */}
                            <div className="lg:hidden mt-12">
                                <h3 className="text-xl font-bold text-text-primary mb-6">Related Posts</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {relatedPosts.map((relatedPost) => (
                                        <Link
                                            key={relatedPost.slug}
                                            to={`/blog/${relatedPost.slug}`}
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                                            className="block p-4 rounded-xl border border-border bg-surface/50 hover:border-primary/50 transition-colors"
                                        >
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {relatedPost.tags.slice(0, 2).map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <h4 className="font-semibold text-text-primary line-clamp-2">{relatedPost.title}</h4>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </article>

                        {/* Right Sidebar - Related Posts (hidden on mobile) */}
                        <aside className="hidden lg:block lg:col-span-3 xl:col-span-3">
                            <RelatedPosts posts={relatedPosts} />
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
