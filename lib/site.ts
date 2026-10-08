/**
 * Single source of truth for the studio's public details.
 *
 * Metadata, JSON-LD, the footer and the contact section all read from here so
 * a changed phone number or address only has to be edited once.
 *
 * Resolution order for the site's own origin, which `metadataBase` uses for
 * OG/canonical URLs and the sitemap emits verbatim:
 *
 *   1. NEXT_PUBLIC_SITE_URL — set this to the live domain in production.
 *   2. VERCEL_URL — set automatically on every Vercel deployment, so preview
 *      builds get their own correct absolute URLs with nothing to configure.
 *      It arrives without a scheme, hence the https:// prefix.
 *   3. localhost, so local builds work.
 *
 * Getting this wrong is quiet rather than loud: the site renders fine while
 * every share card, canonical tag and sitemap entry points somewhere useless.
 */
const FROM_ENV = process.env.NEXT_PUBLIC_SITE_URL;
const FROM_VERCEL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;

export const SITE_URL = (FROM_ENV || FROM_VERCEL || 'http://localhost:3000').replace(/\/$/, '');

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
    street: '502, TGN Square, Next to Kalamandir Jewellers, Chandavarkar Road',
    locality: 'Borivali (West)',
    region: 'Maharashtra',
    city: 'Mumbai',
    postalCode: '400092',
    country: 'IN',
    full: '502, TGN Square, Next to Kalamandir Jewellers, Chandavarkar Road, Borivali (West), Mumbai 400092',
  },
  geo: { lat: 19.2295, lng: 72.848 },
  foundingYear: 2010,
  areaServed: 'Mumbai Metropolitan Region, Maharashtra',
} as const;

// Searched by name and street rather than by coordinates, so the pin lands on
// the building itself instead of a rough point in Borivali.
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  'TGN Square, Chandavarkar Road, Borivali West, Mumbai 400092',
)}`;

/**
 * The site's navigation, read by both the header and the footer.
 *
 * These were two separate arrays, which is how the footer came to be still
 * offering Studio, Practice and Work after the header had been pared back to
 * three — a visitor met two different ideas of the site depending on which end
 * of the page they were at.
 */
export const NAV_LINKS = [
  { href: '/work', label: 'Projects' },
  { href: '/interiors', label: 'Interiors' },
  { href: '/#contact', label: 'Contact' },
] as const;

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
      streetAddress: `${SITE.address.street}, ${SITE.address.locality}`,
      postalCode: SITE.address.postalCode,
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
