import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    ogImage?: string;
    ogType?: 'website' | 'article';
    publishedAt?: string;
    updatedAt?: string;
    tags?: string[];
}

const SITE_NAME = 'Nikhil Kumar | DevOps Cloud Engineer';
const DEFAULT_DESCRIPTION = 'DevOps Cloud Engineer specializing in CI/CD, AWS, Kubernetes, and infrastructure automation.';
const SITE_URL = 'https://nikhilkumar.tech';

export function SEOHead({
    title,
    description = DEFAULT_DESCRIPTION,
    canonicalUrl,
    ogImage = '/og-image.jpg',
    ogType = 'website',
    publishedAt,
    updatedAt,
    tags = [],
}: SEOHeadProps) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const fullUrl = canonicalUrl ? `${SITE_URL}${canonicalUrl}` : SITE_URL;
    const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            {tags.length > 0 && <meta name="keywords" content={tags.join(', ')} />}

            {/* Canonical URL */}
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullOgImage} />
            <meta property="og:site_name" content={SITE_NAME} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={fullOgImage} />

            {/* Article specific meta (for blog posts) */}
            {ogType === 'article' && publishedAt && (
                <meta property="article:published_time" content={publishedAt} />
            )}
            {ogType === 'article' && updatedAt && (
                <meta property="article:modified_time" content={updatedAt} />
            )}
            {ogType === 'article' && tags.map((tag) => (
                <meta key={tag} property="article:tag" content={tag} />
            ))}
        </Helmet>
    );
}
