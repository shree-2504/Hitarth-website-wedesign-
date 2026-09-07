import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The Sanity Studio is an authoring tool, not public content.
      disallow: '/studio',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
