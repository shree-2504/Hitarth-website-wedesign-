export type Project = {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: string;
  imageUrl: string;
  // Focal point for the cover where it is cropped into a wide frame (the
  // project page's full-width header), as a CSS object-position. Defaults to
  // the centre; set it when something worth keeping sits near an edge.
  imagePosition?: string;
  // 'contain' shows the whole cover inside the wide header, over a blurred
  // copy of itself, instead of cropping it to fill. For covers too small or
  // too square to survive being stretched across the full width.
  imageFit?: 'cover' | 'contain';
  // Additional angles shown in a gallery on the project's detail page.
  // Does not include imageUrl itself.
  images?: string[];
  description?: string;
  // Optional spec-sheet facts, rendered as a panel on the detail page. Every
  // one is optional and the panel hides entirely when none are set, so a
  // project with nothing filled in looks exactly as it did before.
  year?: string;
  client?: string;
  area?: string;
  status?: string;
  scope?: string;
};

/**
 * The type to print on a project. `category` drives the filters, and the
 * catch-all "others" group is only meaningful as a filter, so a project filed
 * there is labelled by its own location tag instead ("Hospital").
 */
export function typeLabel(p: Pick<Project, 'category' | 'location'>) {
  return p.category === 'others' ? p.location : p.category;
}

export const fallbackProjects: Project[] = [
  {
    id: 'niyara-residency',
    slug: 'niyara-residency',
    title: 'Niyara Residency',
    location: 'Residential Development',
    category: 'residential',
    imageUrl: '/images/work/niyara-residency-1.jpg',
    images: [
      '/images/work/niyara-residency-2.jpg',
      '/images/work/niyara-residency-3.jpg',
      '/images/work/niyara-residency-4.jpg',
      '/images/work/niyara-residency-5.jpg',
      '/images/work/niyara-residency-6.jpg',
    ],
    description:
      'A multi-wing residential development whose stepped towers are framed by warm copper-toned fins, set over landscaped grounds with a dedicated clubhouse and rooftop terrace.',
  },
  {
    id: 'seasons',
    slug: 'seasons',
    title: 'Seasons',
    location: 'Residential Masterplan',
    category: 'residential',
    imageUrl: '/images/work/seasons-evening.jpg',
    images: [
      '/images/work/seasons-aerial.jpg',
      '/images/coastal-towers.jpg',
      '/images/street-view.jpg',
      '/images/work/seasons-clubhouse.jpg',
      '/images/tower-cluster.jpg',
    ],
    description:
      'A multi-tower residential masterplan combining podium amenity decks, shared landscaped grounds and a mix of tower typologies phased across the site.',
  },
  {
    id: 'animal-hospital',
    slug: 'animal-hospital',
    title: 'Shrimad Rajchandra Animal Hospital',
    location: 'Hospital',
    category: 'others',
    imageUrl: '/images/work/animal-hospital-1.jpg',
    // The hospital's name runs along the parapet, which a centred crop cut off.
    imagePosition: 'center 12%',
    images: [
      '/images/work/animal-hospital-2.jpg',
      '/images/work/animal-hospital-3.jpg',
      '/images/work/animal-hospital-4.jpg',
    ],
    description:
      'An animal hospital designed around clear circulation between public, clinical and service areas, with a street presence suited to daily public access.',
  },
  {
    id: 'sk-heights',
    slug: 'sk-heights',
    title: 'S.K. Heights',
    location: 'Residential Tower',
    category: 'residential',
    imageUrl: '/images/work/sk-heights-1.jpg',
    images: [
      '/images/work/sk-heights-2.jpg',
      '/images/work/sk-heights-3.jpg',
      '/images/work/sk-heights-4.jpg',
    ],
    description:
      'A slender high-rise residential tower with a gated, landscaped entrance and ground-floor retail frontage set within a dense urban context.',
  },
  {
    id: '7th-avenue-naigaon',
    slug: '7th-avenue-naigaon',
    title: '7th Avenue',
    location: 'Naigaon',
    category: 'commercial',
    imageUrl: '/images/work/7th-avenue-naigaon-1.jpg',
    images: ['/images/work/7th-avenue-naigaon-1.jpg', '/images/work/7th-avenue-naigaon-2.jpg'],
    description:
      'A sprawling commercial building with office spaces, a banquet hall and retail space.',
  },
  {
    id: 'gulmohar-homes',
    slug: 'gulmohar-homes',
    title: 'Gulmohar Homes',
    location: 'Residential Tower',
    category: 'residential',
    imageUrl: '/images/work/gulmohar-homes-aerial.jpg',
    images: [
      '/images/work/gulmohar-homes-aerial.jpg',
      '/images/work/gulmohar-homes-3.jpg',
      '/images/work/gulmohar-homes-plan.jpg',
      '/images/work/gulmohar-homes-2.jpg',
    ],
    description:
      'A stepped-crown residential tower with a retail-lined ground floor podium, designed to read cleanly at street level while stepping up into a distinctive high-rise silhouette.',
  },
  {
    id: 'aadarsh-education-society',
    slug: 'aadarsh-education-society',
    title: 'Aadarsh Education Society',
    location: 'Institutional',
    category: 'others',
    imageUrl: '/images/work/aadarsh-education-society-1.jpg',
    // Only a 640px square exists; cropped to the full-width header it was
    // magnified threefold and cut to a slice of the facade.
    imageFit: 'contain',
    images: ['/images/work/aadarsh-education-society-1.jpg'],
    description:
      'An institutional education building with a clean, high-rise elevation designed to anchor its street corner.',
  },
];
