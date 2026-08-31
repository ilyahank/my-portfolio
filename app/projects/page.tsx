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
  const { data } = await supabase.from('site_content').select('value').eq('key', 'projects').single();
  const projectList = data?.value || [];

  return (
    <section>
      <Heading text={'Featured Projects'} />
      <Description text="Discover a collection of projects highlighting my journey as a web developer" />
      <div className="space-y-10">
        {projectList.map((project: any, idx: number) => (
          <ProjectCard key={project.id ?? idx} leftAlign={(idx + 1) % 2 === 0} {...project} />
        ))}
      </div>
    </section>
  );
}
