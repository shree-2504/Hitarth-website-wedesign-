import NotFoundContent from '@/components/NotFoundContent';

// Handles notFound() raised inside the site group — e.g. /work/<unknown-slug>.
// The header, footer and backdrop come from the (site) layout.
export default function NotFound() {
  return <NotFoundContent />;
}
