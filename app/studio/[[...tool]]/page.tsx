'use client';

/**
 * This route embeds Sanity Studio directly inside the Next.js app at /studio,
 * so there's no separate project to deploy — the CMS editor lives at
 * yourdomain.com/studio once NEXT_PUBLIC_SANITY_PROJECT_ID is set.
 */
import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
