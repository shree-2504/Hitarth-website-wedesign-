import { sanityClient, hasSanity } from './client';
import { urlFor } from './image';
import { fallbackProjects, type Project } from '@/data/projects';

const PROJECTS_QUERY = `*[_type == "project"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  location,
  category,
  mainImage,
  description
}`;

function mapDoc(doc: any): Project {
  return {
    id: doc._id,
    slug: doc.slug || doc._id,
    title: doc.title,
    location: doc.location || '',
    category: doc.category || '',
    imageUrl: urlFor(doc.mainImage)?.width(1000).quality(75).url() || '',
    description: doc.description || undefined,
  };
}

export async function getProjects(): Promise<Project[]> {
  if (!hasSanity || !sanityClient) {
    return fallbackProjects;
  }

  try {
    const results = await sanityClient.fetch(PROJECTS_QUERY);
    if (!results || results.length === 0) return fallbackProjects;

    return results.map(mapDoc);
  } catch (err) {
    // If Sanity is misconfigured or unreachable, don't break the page —
    // just serve the hardcoded projects instead.
    console.error('Sanity fetch failed, falling back to local data:', err);
    return fallbackProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!hasSanity || !sanityClient) {
    return fallbackProjects.find((p) => p.slug === slug) || null;
  }

  try {
    const doc = await sanityClient.fetch(
      `*[_type == "project" && slug.current == $slug][0] {
        _id, title, "slug": slug.current, location, category, mainImage, description
      }`,
      { slug }
    );
    if (!doc) return fallbackProjects.find((p) => p.slug === slug) || null;
    return mapDoc(doc);
  } catch (err) {
    console.error('Sanity fetch failed, falling back to local data:', err);
    return fallbackProjects.find((p) => p.slug === slug) || null;
  }
}
