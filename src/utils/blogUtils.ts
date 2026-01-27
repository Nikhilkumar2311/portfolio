// Blog utility functions

/**
 * Calculate estimated reading time based on content
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return Math.max(1, minutes);
}

/**
 * Generate SEO-friendly slug from title
 */
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-')          // Replace spaces with hyphens
        .replace(/-+/g, '-')           // Remove consecutive hyphens
        .trim();
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Get all unique tags from blog posts
 */
export function getAllTags(posts: { tags: string[] }[]): string[] {
    const tagSet = new Set<string>();
    posts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
}

/**
 * Filter posts by search query and tag
 */
export function filterPosts<T extends { title: string; excerpt: string; tags: string[] }>(
    posts: T[],
    query: string,
    tag: string | null
): T[] {
    return posts.filter(post => {
        const matchesQuery = query === '' ||
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(query.toLowerCase());

        const matchesTag = !tag || post.tags.includes(tag);

        return matchesQuery && matchesTag;
    });
}

/**
 * Get related posts based on shared tags
 */
export function getRelatedPosts<T extends { slug: string; tags: string[] }>(
    currentPost: T,
    allPosts: T[],
    limit: number = 3
): T[] {
    return allPosts
        .filter(post => post.slug !== currentPost.slug)
        .map(post => ({
            post,
            score: post.tags.filter(tag => currentPost.tags.includes(tag)).length,
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ post }) => post);
}
