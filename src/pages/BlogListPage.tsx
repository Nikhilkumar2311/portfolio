import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionTitle } from '../components/ui/SectionTitle';
import { BlogCard, BlogSearch, BlogTags } from '../components/blog';
import { SEOHead } from '../components/SEOHead';
import { blogPosts } from '../data/blogs';
import { getAllTags, filterPosts } from '../utils/blogUtils';

export function BlogListPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    const allTags = useMemo(() => getAllTags(blogPosts), []);

    const filteredPosts = useMemo(
        () => filterPosts(blogPosts, searchQuery, selectedTag),
        [searchQuery, selectedTag]
    );

    // Sort by date (newest first)
    const sortedPosts = useMemo(
        () => [...filteredPosts].sort((a, b) =>
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        ),
        [filteredPosts]
    );

    return (
        <>
            <SEOHead
                title="Blog"
                description="DevOps insights, tutorials, and learnings. Explore articles on AWS, Docker, Kubernetes, CI/CD, and cloud infrastructure."
                canonicalUrl="/blog"
            />

            <section className="min-h-screen py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionTitle
                        title="Blog"
                        subtitle="DevOps insights, tutorials & learnings"
                    />

                    {/* Search and Filters */}
                    <motion.div
                        className="mb-12 space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Search */}
                        <div className="flex justify-center">
                            <BlogSearch value={searchQuery} onChange={setSearchQuery} />
                        </div>

                        {/* Tags */}
                        <div className="flex justify-center">
                            <BlogTags
                                tags={allTags}
                                selectedTag={selectedTag}
                                onSelectTag={setSelectedTag}
                            />
                        </div>
                    </motion.div>

                    {/* Blog Grid */}
                    {sortedPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sortedPosts.map((post, index) => (
                                <BlogCard key={post.slug} post={post} index={index} />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            className="text-center py-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <p className="text-text-secondary text-lg">
                                No posts found matching your criteria.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedTag(null);
                                }}
                                className="mt-4 text-primary hover:underline"
                            >
                                Clear filters
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>
        </>
    );
}
