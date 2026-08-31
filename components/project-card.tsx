import Link from 'next/link';
import ProjectImageCarousel from '@/components/project-image-carousel';

interface ProjectCardProps {
  leftAlign?: boolean;
  images?: string[];
  image?: string;
  title: string;
  des: string;
  tags: string[];
  url: string;
}

const ProjectCard = ({ leftAlign, images, image, title, des, tags, url }: ProjectCardProps) => {
  const imageList = images && images.length > 0 ? images : image ? [image] : [];

  return (
    <article className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-0">
      {/* Mobile: stacked layout */}
      <div className="w-full lg:hidden order-1">
        <ProjectImageCarousel images={imageList} title={title} />
      </div>
      <div className="w-full max-w-md px-4 order-2 lg:order-1">
        <h2 className="mb-2 block text-left text-lg font-bold md:text-xl lg:text-3xl">
          {url ? (
            <Link href={url} target="_blank">
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="w-full rounded-lg border-2 border-background bg-card p-3 md:p-4 text-left text-xs md:text-base">
          {des}
        </p>
        <ul className="flex flex-wrap cursor-default gap-2 md:gap-5 p-2 text-xs text-muted md:text-base">
          {tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
      </div>
      {/* Desktop: overlay layout */}
      <div className="hidden lg:block relative inline-flex max-w-max w-full order-2">
        <header
          className={
            'absolute bottom-2/4 left-2/4 right-2/4 top-2/4 z-10 ml-0 flex -translate-x-2/4 -translate-y-2/4 items-center justify-center ' +
            (leftAlign ? 'lg:-ml-90' : 'lg:ml-90')
          }
        >
          <div className="w-full max-w-md px-4">
            <h2
              className={
                'mb-2 block text-left text-xl font-bold lg:text-3xl ' +
                (leftAlign ? 'md:text-left' : 'md:text-right')
              }
            >
              {url ? (
                <Link href={url} target="_blank">
                  {title}
                </Link>
              ) : (
                title
              )}
            </h2>
            <p
              className={
                'w-72 lg:w-80 rounded-lg border-2 border-background bg-card p-4 text-left text-base ' +
                (leftAlign ? 'md:text-left' : 'md:text-right')
              }
            >
              {des}
            </p>
            <ul
              className={
                'flex cursor-default gap-5 p-2 text-base ' +
                (leftAlign ? 'justify-start' : 'justify-start lg:justify-end')
              }
            >
              {tags.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          </div>
        </header>
        <ProjectImageCarousel images={imageList} title={title} />
      </div>
    </article>
  );
};

export default ProjectCard;
