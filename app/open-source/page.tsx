import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';

import Description from '@/components/description';
import Heading from '@/components/heading';
import RepoList from '@/components/repo-list';
import RepoSkeleton from '@/components/repo-skeleton';

export const revalidate = 0;

export const metadata = {
  title: 'Open Source',
  description:
    'Explore Shahriar Shafin’s open source repositories, including projects he has published and contributed to on GitHub.'
};

export default async function openSource() {
  const siteSettingsData = await supabase.from('site_content').select('value').eq('key', 'siteSettings').single();
  const siteSettings = siteSettingsData.data?.value || {};
  
  const openSourceHeading = siteSettings.openSourceHeading || 'Open Source';
  const openSourceDescription = siteSettings.openSourceDescription || 'Some open source repositories I have published and contributed to';

  return (
    <section>
      <Heading text={openSourceHeading} />
      <Description text={openSourceDescription} />
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Suspense
          fallback={Array.from({ length: 6 }).map((_, i) => (
            <RepoSkeleton key={i} />
          ))}
        >
          <RepoList />
        </Suspense>
      </div>
    </section>
  );
}
