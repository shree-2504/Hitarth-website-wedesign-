import createImageUrlBuilder from '@sanity/image-url';
import { projectId, dataset } from './client';

const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

export function urlFor(source: any) {
  if (!builder) return null;
  return builder.image(source);
}
