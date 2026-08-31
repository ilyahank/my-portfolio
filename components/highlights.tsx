import { supabase } from '@/lib/supabase';

export const revalidate = 0;

const Highlights = async () => {
  let goalsHeading = 'New year, New goals:';
  let goalsItems = [
    { id: 1, text: 'Deep dive into the Web.3' },
    { id: 2, text: 'Learn Skateboard Tricks!' },
    { id: 3, text: 'Contribute to Open Source projects' }
  ];

  try {
    const { data } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', 'goals')
      .single();

    if (data?.value) {
      if (data.value.heading) goalsHeading = data.value.heading;
      if (data.value.items && Array.isArray(data.value.items)) goalsItems = data.value.items;
    }
  } catch (e) {
    console.error('Error fetching goals data from Supabase:', e);
  }

  return (
    <section className="rounded-xs border-l-4 border-x-primary bg-card p-4 text-primary shadow-sm">
      <h2 className="mb-3 inline-block bg-linear-to-r from-primary via-[#a855f7] to-secondary bg-clip-text text-lg font-bold text-transparent">
        {goalsHeading}
      </h2>
      <ul>
        {goalsItems.map((item) => (
          <HighlightPoint key={item.id} text={item.text} />
        ))}
      </ul>
    </section>
  );
};

interface HighlightPointProps {
  text: string;
}

const HighlightPoint = ({ text }: HighlightPointProps) => (
  <li className="flex cursor-default items-center transition ease-in hover:text-primary-foreground">
    <div className="mr-2 h-1.5 w-1.5 rounded-full bg-white"></div>
    {text}
  </li>
);

export default Highlights;
