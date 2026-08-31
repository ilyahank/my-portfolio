import { supabase } from '@/lib/supabase';

const Footer = async () => {
  let copyrightName = 'Shahriar Shafin';
  let socialMedia = [];

  try {
    const [profileData, settingsData, socialData] = await Promise.all([
      supabase.from('site_content').select('value').eq('key', 'profile').single(),
      supabase.from('site_content').select('value').eq('key', 'siteSettings').single(),
      supabase.from('site_content').select('value').eq('key', 'socialMedia').single()
    ]);

    if (settingsData.data?.value?.copyrightName) {
      copyrightName = settingsData.data.value.copyrightName;
    } else if (profileData.data?.value?.name) {
      copyrightName = profileData.data.value.name;
    }

    if (socialData.data?.value && Array.isArray(socialData.data.value)) {
      socialMedia = socialData.data.value;
    }
  } catch (e) {
    console.error('Error fetching footer data from Supabase:', e);
  }

  return (
    <footer className="mx-auto w-full max-w-200 px-10 py-2 md:px-0">
      <div className="flex flex-col items-center justify-between gap-2 p-4 md:flex-row">
        <p className="order-2 md:order-1">© {new Date().getFullYear()} {copyrightName}</p>
        <div className="order-1 flex gap-3 text-lg md:order-2">
          {socialMedia.map((social: any) => (
            <a
              key={social.id}
              href={social.url}
              aria-label={social.label}
              target="_blank"
              className="rounded-xl p-3 transition ease-in hover:bg-background hover:text-primary"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
