
'use client';

import { ProjectType } from '@/db/tables/project';
import { cn } from '@/lib/utils';
import { ProjectCard } from '@/components/project/ProjectCard';
import { useMemo, useState } from 'react';
import { useSticky } from '@/hooks/useSticky';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '../ui/carousel';
import AutoScroll from 'embla-carousel-auto-scroll';

type ProjectListVariant = 'grid' | 'column' | 'vertical' | 'column-2';

const style: Record<
  ProjectListVariant,
  {
    wrapper: string;
    item: string;
  }
> = {
  column: {
    wrapper: 'flex-col',
    item: 'w-full',
  },
  grid: {
    wrapper: 'flex flex-row flex-wrap gap-2',
    item: 'w-[calc(33.333%-6px)]',
  },
  vertical: {
    wrapper: 'flex-row',
    item: 'w-full',
  },
  'column-2': {
    wrapper: 'block columns-1 sm:columns-2 gap-x-4',
    item: 'mb-4 break-inside-avoid',
  },
};

type ProjectListProps = {
  projects: ProjectType[];
  variant?: ProjectListVariant;
  filter?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const ProjectList = ({
  projects,
  variant = 'grid',
  filter = false,
  ...attr
}: ProjectListProps) => {
  const [currentTag, setCurrentTag] = useState('All');

  const { ref, isSticky } = useSticky<HTMLDivElement>(0);

  const tags = useMemo(() => {
    const tagsSet = new Set<string>();

    projects.forEach(project => {
      project.tags
        ?.split(',')
        .map(tag => tag.trim())
        .filter(Boolean)
        .forEach(tag => tagsSet.add(tag));
    });

    return ['All', ...Array.from(tagsSet)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (currentTag === 'All') {
      return projects;
    }

    return projects.filter(project =>
      (project.tags ?? '')
        .split(',')
        .map(tag => tag.trim())
        .includes(currentTag)
    );
  }, [projects, currentTag]);

  const handleTagClick = (tag: string) => {
    setCurrentTag(tag);
  };

  const renderTags = () =>
    tags.map(tag => (
      <button
        type="button"
        onClick={() => handleTagClick(tag)}
        className={cn(
          'px-2 py-1 border border-foreground/30 transition-all',
          'bg-background/30 hover:bg-foreground hover:text-background',
          'rounded-md backdrop-blur-[10px] h-min cursor-pointer',
          'text-nowrap',
          currentTag === tag && 'text-background bg-foreground'
        )}
        key={tag}
      >
        {tag}
      </button>
    ));

  return (
    <>
      {filter && (
        <>
          <motion.div
            ref={ref}
            initial={false}
            animate={{
              opacity: isSticky ? 0 : 1,
              y: isSticky ? -10 : 0,
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              'flex gap-2 w-full flex-wrap mb-6 text-foreground h-min'
            )}
            style={{ pointerEvents: isSticky ? 'none' : 'auto' }}
          >
            {renderTags()}
          </motion.div>

          <Carousel
            style={{
              display: isSticky ? 'block' : 'none',
            }}
            plugins={[
              AutoScroll({
                speed: 0.5,
                startDelay: 2000,
                playOnInit: true,
                stopOnMouseEnter: false,
                stopOnFocusIn: false,
                stopOnInteraction: false,
              }),
            ]}
            opts={{
              align: 'start',
              dragFree: true,
              loop: true,
            }}
            orientation="horizontal"
            className="z-[100] fixed w-full top-[80px] left-0"
          >
            <CarouselContent className="ml-2">
              {tags.map(tag => (
                <CarouselItem
                  onClick={() => handleTagClick(tag)}
                  title={tag}
                  key={tag}
                  className={cn(
                    'basis-auto mx-1 px-2 py-1',
                    'border border-foreground/30 transition-all',
                    'bg-background/30 hover:bg-foreground hover:text-background',
                    'rounded-md backdrop-blur-[10px] h-min cursor-pointer',
                    'text-nowrap z-[100] relative select-none',
                    currentTag === tag && 'text-background bg-foreground'
                  )}
                >
                  {tag}
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </>
      )}

      <motion.section
        layout
        className={cn(
          'flex',
          style[variant].wrapper,
          attr.className
        )}
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                duration: 0.3,
                delay: index * 0.04,
              }}
              className={cn(
                style[variant].item,
                variant === 'grid' && 'min-w-0'
              )}
            >
              <ProjectCard
                link={`/projects/${project.id}`}
                limitTag={2}
                className="w-full"
                variant="background"
                project={project}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.section>
    </>
  );
};
