import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Studio from '@/components/Studio';
import PracticeTabs from '@/components/PracticeTabs';
import Work from '@/components/Work';
import Contact from '@/components/Contact';
import { getProjects } from '@/lib/sanity/queries';

export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <Hero projects={projects} />
      <Stats />
      <Studio />
      <PracticeTabs />
      <Work projects={projects} />
      <Contact />
    </>
  );
}
