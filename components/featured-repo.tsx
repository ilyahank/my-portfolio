import Link from 'next/link';

import { HiCursorClick } from 'react-icons/hi';

import { supabase } from '@/lib/supabase';

import Heading from './heading';
import RepoCard from './repo-card';

export const revalidate = 0;

export default async function FeaturedRepo() {
  let repositoriesHeading = 'Featured Repositories';
  let repositories = [];

  try {
    const [settingsData, reposData] = await Promise.all([
      supabase.from('site_content').select('value').eq('key', 'siteSettings').single(),
      supabase.from('site_content').select('value').eq('key', 'featuredRepositories').single()
    ]);
    
    if (settingsData.data?.value?.repositoriesHeading) {
      repositoriesHeading = settingsData.data.value.repositoriesHeading;
    }

    if (reposData.data?.value && Array.isArray(reposData.data.value)) {
      repositories = reposData.data.value;
    }
  } catch (e) {
    console.error('Error fetching featured repositories from Supabase:', e);
  }

  return (
    <section>
      <Heading text={repositoriesHeading} />
      <div className="mt-3 space-y-4">
        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
          {repositories.map((repo: any, index: number) => (
            <RepoCard
              key={repo.id ?? repo.url ?? repo.title ?? index}
              html_url={repo.url}
              name={repo.title}
              stargazers_count={repo.stars}
              forks_count={repo.forks}
              description={repo.description}
              topics={repo.tags}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Link
          href="/open-source"
          className="mt-10 flex w-auto justify-center gap-2 text-base text-primary transition ease-in hover:text-primary-foreground"
        >
          <span>More Repositories</span>
          <HiCursorClick className="inline-block text-xl" />
        </Link>
      </div>
    </section>
  );
}
