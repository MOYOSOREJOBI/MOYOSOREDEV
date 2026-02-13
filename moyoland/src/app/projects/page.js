import TopNav from '@/components/TopNav';
import ProjectGrid from '@/components/projects/ProjectGrid';
import { PROJECTS } from '@/content/projects';

export const metadata = { title: 'MOYOLAND - Projects' };

export default function ProjectsPage() {
  return (
    <>
      <TopNav title="Projects" />
      <ProjectGrid projects={PROJECTS} />
    </>
  );
}
