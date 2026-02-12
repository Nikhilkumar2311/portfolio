import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Plugin } from 'vite';

const SITE_URL = 'https://nikhilkumar.tech';
const BLOGS_DIR = path.resolve(__dirname, '../src/content/blogs');

interface SitemapEntry {
    loc: string;
    lastmod?: string;
    changefreq: string;
    priority: string;
}

function getBlogEntries(): SitemapEntry[] {
    const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith('.md'));

    return files.map(file => {
        const content = fs.readFileSync(path.join(BLOGS_DIR, file), 'utf-8');
        const { data } = matter(content);
        const slug = data.slug || file.replace('.md', '');
        const lastmod = data.publishedAt
            ? new Date(data.publishedAt).toISOString().split('T')[0]
            : undefined;

        return {
            loc: `${SITE_URL}/blog/${slug}`,
            lastmod,
            changefreq: 'yearly',
            priority: '0.6',
        };
    });
}

function buildSitemapXml(entries: SitemapEntry[]): string {
    const urls = entries
        .map(entry => {
            const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
            return `  <url>
    <loc>${entry.loc}</loc>${lastmod}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function generateSitemap(outDir: string): void {
    const today = new Date().toISOString().split('T')[0];

    const staticEntries: SitemapEntry[] = [
        { loc: `${SITE_URL}/`, lastmod: today, changefreq: 'monthly', priority: '1.0' },
        { loc: `${SITE_URL}/blog`, lastmod: today, changefreq: 'weekly', priority: '0.8' },
    ];

    const blogEntries = getBlogEntries();
    const allEntries = [...staticEntries, ...blogEntries];
    const xml = buildSitemapXml(allEntries);

    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), xml, 'utf-8');
    console.log(`✅ Sitemap generated with ${allEntries.length} URLs → ${outDir}/sitemap.xml`);
}

/** Vite plugin that generates sitemap.xml after build */
export function sitemapPlugin(): Plugin {
    return {
        name: 'generate-sitemap',
        closeBundle() {
            const outDir = path.resolve(__dirname, '../dist');
            generateSitemap(outDir);
        },
    };
}
