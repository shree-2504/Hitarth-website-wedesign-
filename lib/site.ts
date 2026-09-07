/**
 * Single source of truth for the studio's public details.
 *
 * Metadata, JSON-LD, the footer and the contact section all read from here so
 * a changed phone number or address only has to be edited once.
 *
 * NEXT_PUBLIC_SITE_URL must be set to the live domain in production — it's
 * what `metadataBase` resolves OG/canonical URLs against, and what the sitemap
 * emits. The fallback only keeps local builds working.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
).replace(/\/$/, '');

export const SITE = {
  name: 'We Design Architects',
  shortName: 'We Design',
  tagline: 'Architectural consultant',
  description:
    'A Mumbai-based studio specialising in planning, design and CRZ approvals — from high-end residential towers to sprawling commercial and industrial layouts.',
  phone: '+91 93242 70864',
  // E.164, for tel: links and structured data
  phoneHref: '+919324270864',
  email: 'we.designarc@gmail.com',
  address: {
    locality: 'Borivali (W)',
    region: 'Maharashtra',
    city: 'Mumbai',
    country: 'IN',
    full: 'Borivali (W), Mumbai, Maharashtra',
  },
  geo: { lat: 19.2295, lng: 72.848 },
  foundingYear: 2010,
  areaServed: 'Mumbai Metropolitan Region, Maharashtra',
} as const;

export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${SITE.geo.lat},${SITE.geo.lng}`;

/**
 * Schema.org node describing the studio. Google uses this for the knowledge
 * panel / local results — the services list is what ties the studio to "CRZ
 * approval" searches, which is the practice's actual differentiator.
 */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#studio`,
    name: SITE.name,
    description: SITE.description,
    url: SITE_URL,
    telephone: SITE.phoneHref,
    email: SITE.email,
    image: `${SITE_URL}/images/hero-aerial.jpg`,
    foundingDate: String(SITE.foundingYear),
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
      streetAddress: SITE.address.locality,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    areaServed: SITE.areaServed,
    knowsAbout: [
      'Site and master planning',
      'Architectural design',
      'Coastal Regulation Zone (CRZ) approvals',
      'Interior design',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Architectural services',
      itemListElement: [
        'Site & master planning',
        'Architectural design',
        'CRZ approvals',
        'Interior design',
      ].map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name },
      })),
    },
  };
}
