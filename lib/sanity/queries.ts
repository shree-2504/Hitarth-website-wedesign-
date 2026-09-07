import { sanityClient, hasSanity } from './client';
import { urlFor } from './image';
import { fallbackProjects, type Project } from '@/data/projects';

// Kept in one place so the list and single-project queries can't drift apart —
// `gallery` in particular used to be missing here while the detail page
// rendered from it, so every Sanity-backed project showed an empty gallery.
const PROJECT_FIELDS = `
  _id,
  title,
  "slug": slug.current,
  location,
  category,
  mainImage,
  gallery,
  description,
  year,
  client,
  area,
  status,
  scope
`;

const PROJECTS_QUERY = `*[_type == "project"] | order(order asc) { ${PROJECT_FIELDS} }`;

function mapDoc(doc: any): Project {
  return {
    id: doc._id,
    slug: doc.slug || doc._id,
    title: doc.title,
    location: doc.location || '',
    category: doc.category || '',
    imageUrl: urlFor(doc.mainImage)?.width(1600).quality(78).url() || '',
    images: Array.isArray(doc.gallery)
      ? doc.gallery
          .map((img: any) => urlFor(img)?.width(1600).quality(78).url())
          .filter((url: string | undefined): url is string => Boolean(url))
      : undefined,
    description: doc.description || undefined,
    year: doc.year || undefined,
    client: doc.client || undefined,
    area: doc.area || undefined,
    status: doc.status || undefined,
    scope: doc.scope || undefined,
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
      `*[_type == "project" && slug.current == $slug][0] { ${PROJECT_FIELDS} }`,
      { slug }
    );
    if (!doc) return fallbackProjects.find((p) => p.slug === slug) || null;
    return mapDoc(doc);
  } catch (err) {
    console.error('Sanity fetch failed, falling back to local data:', err);
    return fallbackProjects.find((p) => p.slug === slug) || null;
  }
}
