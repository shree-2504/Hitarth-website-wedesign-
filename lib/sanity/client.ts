import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2024-01-01';

// If no project ID is configured, `hasSanity` is false and every page falls
// back to the hardcoded data in /data — so the site works immediately,
// with or without the CMS wired up.
export const hasSanity = Boolean(projectId);

export const sanityClient = hasSanity
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;
