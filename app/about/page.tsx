import { supabase } from '@/lib/supabase';
import EduCard from '@/components/educard';
import Heading from '@/components/heading';
import SkillCap from '@/components/skill-cap';

export const revalidate = 0;

export const metadata = {
  title: 'About',
  description:
    "Discover Shahriar Shafin's journey in web development, from his foundational education in Computer Science to his professional experience as a software engineer. Skilled in technologies like JavaScript, React, Next.js, and more."
};

export default async function About() {
  let skills = [];
  let companies = [];
  let institutions = [];

  try {
    const [skillsData, companiesData, institutionsData] = await Promise.all([
      supabase.from('site_content').select('value').eq('key', 'skills').single(),
      supabase.from('site_content').select('value').eq('key', 'companies').single(),
      supabase.from('site_content').select('value').eq('key', 'institutions').single()
    ]);

    if (skillsData.data?.value && Array.isArray(skillsData.data.value)) {
      skills = skillsData.data.value;
    }

    if (companiesData.data?.value && Array.isArray(companiesData.data.value)) {
      companies = companiesData.data.value;
    }

    if (institutionsData.data?.value && Array.isArray(institutionsData.data.value)) {
      institutions = institutionsData.data.value;
    }
  } catch (e) {
    console.error('Error fetching about page data from Supabase:', e);
  }

  return (
    <>
      <section>
        <Heading text={'Tech Stack'} />

        <div className="mt-3 flex w-full flex-wrap gap-4 lg:px-5">
          {skills.map((item: any) => (
            <SkillCap key={item.id} {...item} />
          ))}
        </div>
      </section>

      <section>
        <Heading text={'Career'} />

        <div className="mt-3 space-y-4 lg:px-5">
          {companies.map((edu: any) => (
            <EduCard key={edu.id} {...edu} />
          ))}
        </div>
      </section>

      <section>
        <Heading text={'Education'} />

        <div className="mt-3 space-y-4 lg:px-5">
          {institutions.map((edu: any) => (
            <EduCard key={edu.id} {...edu} />
          ))}
        </div>
      </section>
    </>
  );
}
