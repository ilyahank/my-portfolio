import Description from '@/components/description';
import Heading from '@/components/heading';
import ProjectCard from '@/components/project-card';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Projects',
  description:
    "A showcase of Shahriar Shafin's development work, demonstrating expertise in creating dynamic, user-focused web applications using modern frontend technologies."
};

export const revalidate = 0;

export default async function Projects() {
  const [projectsData, siteSettingsData] = await Promise.all([
    supabase.from('site_content').select('value').eq('key', 'projects').single(),
    supabase.from('site_content').select('value').eq('key', 'siteSettings').single()
  ]);
  
  const projectList = projectsData.data?.value || [];
  const siteSettings = siteSettingsData.data?.value || {};
  
  const projectsHeading = siteSettings.projectsHeading || 'Featured Projects';
  const projectsDescription = siteSettings.projectsDescription || 'Discover a collection of projects highlighting my journey as a web developer';

  return (
    <section className="px-4 py-8">
      <Heading text={projectsHeading} />
      <Description text={projectsDescription} />
      <div className="space-y-12 lg:space-y-10">
        {projectList.map((project: any, idx: number) => (
          <ProjectCard key={project.id ?? idx} leftAlign={(idx + 1) % 2 === 0} {...project} />
        ))}
      </div>
    </section>
  );
}
