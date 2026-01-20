import Head from 'next/head';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    ogType?: 'website' | 'article' | 'profile';
    twitterCard?: 'summary' | 'summary_large_image';
    canonical?: string;
    noindex?: boolean;
}

const defaultSEO = {
    title: 'EquityBuild - Connect Startups with Top Talent for Equity',
    description: 'The premier platform connecting innovative startups with talented professionals seeking equity opportunities. Build your dream team, find your next venture, grow together.',
    keywords: ['startup', 'equity', 'talent', 'co-founder', 'jobs', 'careers', 'entrepreneurship', 'venture', 'team building'],
    ogImage: '/og-image.png',
    ogType: 'website' as const,
    twitterCard: 'summary_large_image' as const,
};

export function SEO({
    title,
    description,
    keywords,
    ogImage,
    ogType,
    twitterCard,
    canonical,
    noindex = false,
}: SEOProps) {
    const seoTitle = title ? `${title} | EquityBuild` : defaultSEO.title;
    const seoDescription = description || defaultSEO.description;
    const seoKeywords = keywords || defaultSEO.keywords;
    const seoOgImage = ogImage || defaultSEO.ogImage;
    const seoOgType = ogType || defaultSEO.ogType;
    const seoTwitterCard = twitterCard || defaultSEO.twitterCard;
    const seoCanonical = canonical || (typeof window !== 'undefined' ? window.location.href : '');

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{seoTitle}</title>
            <meta name="title" content={seoTitle} />
            <meta name="description" content={seoDescription} />
            <meta name="keywords" content={seoKeywords.join(', ')} />

            {/* Robots */}
            {noindex && <meta name="robots" content="noindex,nofollow" />}

            {/* Canonical */}
            {canonical && <link rel="canonical" href={seoCanonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={seoOgType} />
            <meta property="og:url" content={seoCanonical} />
            <meta property="og:title" content={seoTitle} />
            <meta property="og:description" content={seoDescription} />
            <meta property="og:image" content={seoOgImage} />
            <meta property="og:site_name" content="EquityBuild" />

            {/* Twitter */}
            <meta property="twitter:card" content={seoTwitterCard} />
            <meta property="twitter:url" content={seoCanonical} />
            <meta property="twitter:title" content={seoTitle} />
            <meta property="twitter:description" content={seoDescription} />
            <meta property="twitter:image" content={seoOgImage} />

            {/* Additional Meta Tags */}
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <meta name="theme-color" content="#5C6BC0" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="EquityBuild" />

            {/* Favicon */}
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/manifest.json" />
        </Head>
    );
}

// JSON-LD Schema for better SEO
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'EquityBuild',
        description: 'Platform connecting startups with talent for equity opportunities',
        url: 'https://equitybuild.com',
        logo: 'https://equitybuild.com/logo.png',
        sameAs: [
            'https://twitter.com/equitybuild',
            'https://linkedin.com/company/equitybuild',
            'https://github.com/equitybuild',
        ],
    };
}

export function generateWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'EquityBuild',
        url: 'https://equitybuild.com',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://equitybuild.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string',
        },
    };
}
