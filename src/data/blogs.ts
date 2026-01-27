import fm from 'front-matter';
import { calculateReadingTime } from '../utils/blogUtils';
import type { BlogPost } from '../types';

// Frontmatter attributes interface
interface BlogFrontmatter {
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: number;
}

// Use Vite's import.meta.glob to dynamically import all markdown files
const blogFiles = import.meta.glob('../content/blogs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
});

/**
 * Parse frontmatter from markdown and create BlogPost objects
 */
function parseBlogPost(filePath: string, rawContent: string): BlogPost {
  const parsed = fm<BlogFrontmatter>(rawContent);
  const { attributes, body } = parsed;

  // Calculate reading time from content
  const readingTime = attributes.readingTime || calculateReadingTime(body);

  // Format date as YYYY-MM-DD
  const formatDate = (date: string | undefined): string => {
    if (!date) return new Date().toISOString().split('T')[0];
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };

  return {
    slug: attributes.slug || filePath.split('/').pop()?.replace('.md', '') || '',
    title: attributes.title || 'Untitled',
    excerpt: attributes.excerpt || body.slice(0, 160).replace(/[#\n]/g, ' ').trim() + '...',
    content: body,
    coverImage: attributes.coverImage,
    tags: attributes.tags || [],
    publishedAt: formatDate(attributes.publishedAt),
    updatedAt: attributes.updatedAt ? formatDate(attributes.updatedAt) : undefined,
    readingTime,
  };
}

/**
 * All blog posts parsed from markdown files
 * Sorted by published date (newest first)
 */
export const blogPosts: BlogPost[] = Object.entries(blogFiles)
  .map(([filePath, rawContent]) => parseBlogPost(filePath, rawContent as string))
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

/**
 * Get a single blog post by slug
 */
export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}
