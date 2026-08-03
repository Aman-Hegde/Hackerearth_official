import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ExternalLink, Play, Book, Video, FileText, Zap, Laptop } from 'lucide-react';
import { blogPosts, type BlogPost } from '../lib/resourcesData';

interface Resource {
  title: string;
  link: string;
  type: string;
  emoji?: string;
}

interface ResourceSection {
  title: string;
  description: string;
  resources: Resource[];
  sectionType: 'core-tutorials' | 'video-courses' | 'docs' | 'es6-features' | 'practice' | 'reading';
  icon: string;
}

interface ResourceDisplayProps {
  resourceSections: ResourceSection[];
}

const categoryAccentStyles: Record<BlogPost['category'], {
  card: string;
  icon: string;
  text: string;
}> = {
  general: {
    card: 'border-primary/30 top-border-accent-primary',
    icon: 'border-primary/25 bg-primary/10 text-primary-text',
    text: 'text-primary-text',
  },
  web: {
    card: 'border-technical/30 top-border-accent-cyan',
    icon: 'border-technical/25 bg-technical/10 text-technical-text',
    text: 'text-technical-text',
  },
  dsa: {
    card: 'border-creative/30 top-border-accent-violet',
    icon: 'border-creative/25 bg-creative/10 text-creative-text',
    text: 'text-creative-text',
  },
  aptitude: {
    card: 'border-highlight/30 top-border-accent-amber',
    icon: 'border-highlight/25 bg-highlight/10 text-highlight-text',
    text: 'text-highlight-text',
  },
};

const getSectionIcon = (sectionType: ResourceSection['sectionType']) => {
  const icons = {
    'core-tutorials': <Book size={20} />,
    'video-courses': <Video size={20} />,
    'docs': <FileText size={20} />,
    'es6-features': <Zap size={20} />,
    'practice': <Laptop size={20} />,
    'reading': <Book size={20} />,
  };

  return icons[sectionType] || icons['core-tutorials'];
};

// Resource Item Component
const ResourceItem = ({
  resource,
  index,
  accent,
  shouldReduceMotion,
}: {
  resource: Resource;
  index: number;
  accent: (typeof categoryAccentStyles)[BlogPost['category']];
  shouldReduceMotion: boolean;
}) => {
  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.5,
        delay: shouldReduceMotion ? 0 : index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`ui-card group relative flex h-full min-w-0 flex-col overflow-hidden p-5 transition duration-300 ease-out-expo hover:shadow-surface ${accent.card}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-control border ${accent.icon}`}>
            <span className="text-sm">{resource.emoji}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-semibold leading-tight text-ink">
              {resource.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">
              {resource.type}
            </p>
          </div>
        </div>

        {/* External link indicator */}
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { x: 2 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          className={`ml-2 shrink-0 rounded-full p-1.5 opacity-70 transition-opacity group-hover:opacity-100 ${accent.text}`}
          aria-hidden="true"
        >
          <ExternalLink size={14} />
        </motion.div>
      </div>

      {/* Visit link with animation */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <span className="text-xs font-medium text-ink-subtle">
          {resource.type.split('\u2022')[0].trim()}
        </span>

        <motion.a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-ghost min-h-11 px-3 py-2 text-sm ${accent.text}`}
          whileHover={shouldReduceMotion ? undefined : { x: 2 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          aria-label={`Visit ${resource.title}`}
        >
          <span>Visit</span>
          <span aria-hidden="true">
            <Play size={12} />
          </span>
        </motion.a>
      </div>
    </motion.article>
  );
};

// Section Header Component
const SectionHeader = ({
  title,
  description,
  sectionType,
  accent,
  shouldReduceMotion,
}: {
  title: string;
  description: string;
  sectionType: ResourceSection['sectionType'];
  accent: (typeof categoryAccentStyles)[BlogPost['category']];
  shouldReduceMotion: boolean;
}) => {
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="mb-6 sm:mb-8"
    >
      <div className="flex items-center gap-3">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-control border ${accent.icon}`}>
          {getSectionIcon(sectionType)}
        </div>
        <h2 className="font-display text-2xl font-semibold text-ink">
          {title}
        </h2>
      </div>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">
        {description}
      </p>
    </motion.div>
  );
};

// Main Resource Display Component
export const ResourceDisplay = ({ resourceSections }: ResourceDisplayProps) => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const category = useMemo(
    () => blogPosts.find((post) => post.resourceSections === resourceSections)?.category ?? 'general',
    [resourceSections],
  );
  const accent = categoryAccentStyles[category] || categoryAccentStyles.general;

  return (
    <div className="w-full space-y-12 sm:space-y-16">
      {resourceSections.map((section, sectionIndex) => (
        <section key={sectionIndex} className="w-full">
          <SectionHeader
            title={section.title}
            description={section.description}
            sectionType={section.sectionType}
            accent={accent}
            shouldReduceMotion={shouldReduceMotion}
          />

          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
            {section.resources.map((resource, resourceIndex) => (
              <ResourceItem
                key={resourceIndex}
                resource={resource}
                index={resourceIndex}
                accent={accent}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ResourceDisplay;
