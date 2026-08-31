import { supabase } from '@/lib/supabase';
import RepoCard from './repo-card';

interface OpenSourceProject {
  id: number;
  title: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  tags: string[];
}

const RepoList = async () => {
  // Fetch open source projects from Supabase
  let projects: OpenSourceProject[] = [];
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', 'openSourceProjects')
      .single();
    
    if (data?.value && Array.isArray(data.value)) {
      projects = data.value;
    }
  } catch (e) {
    console.error('Error fetching from Supabase:', e);
  }

  // If no projects in Supabase, return empty state
  if (projects.length === 0) {
    return <div className="text-gray-500 text-center py-8">No open source projects added yet.</div>;
  }

  return (
    <>
      {projects.map((project) => (
        <RepoCard
          key={project.id}
          html_url={project.url}
          name={project.title}
          stargazers_count={project.stars}
          forks_count={project.forks}
          description={project.description}
          topics={project.tags}
        />
      ))}
    </>
  );
};

export default RepoList;
