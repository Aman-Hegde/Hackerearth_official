import { motion } from 'framer-motion';
import { ExternalLink, Play, Book, Video, FileText, Zap, Laptop } from 'lucide-react';

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

// Style configuration for different section types
const getSectionStyleConfig = (sectionType: ResourceSection['sectionType']) => {
  const styles = {
    'core-tutorials': {
      icon: <Book size={20} />,
      iconClass: 'border-brand-500/20 bg-brand-500/10 text-brand-700 dark:text-brand-300',
      textClass: 'text-brand-700 dark:text-brand-300'
    },
    'video-courses': {
      icon: <Video size={20} />,
      iconClass: 'border-accent-500/20 bg-accent-500/10 text-accent-700 dark:text-accent-300',
      textClass: 'text-accent-700 dark:text-accent-300'
    },
    'docs': {
      icon: <FileText size={20} />,
      iconClass: 'border-signal-500/20 bg-signal-500/10 text-signal-700 dark:text-signal-300',
      textClass: 'text-signal-700 dark:text-signal-300'
    },
    'es6-features': {
      icon: <Zap size={20} />,
      iconClass: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
      textClass: 'text-amber-700 dark:text-amber-300'
    },
    'practice': {
      icon: <Laptop size={20} />,
      iconClass: 'border-signal-500/20 bg-signal-500/10 text-signal-700 dark:text-signal-300',
      textClass: 'text-signal-700 dark:text-signal-300'
    },
    'reading': {
      icon: <Book size={20} />,
      iconClass: 'border-brand-500/20 bg-brand-500/10 text-brand-700 dark:text-brand-300',
      textClass: 'text-brand-700 dark:text-brand-300'
    }
  };

  return styles[sectionType] || styles['core-tutorials'];
};

// Resource Item Component
const ResourceItem = ({ resource, index, sectionType }: { resource: Resource; index: number; sectionType: ResourceSection['sectionType'] }) => {
  const style = getSectionStyleConfig(sectionType);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="ui-card-interactive group relative flex h-full min-w-0 flex-col overflow-hidden p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-control border ${style.iconClass}`}>
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
          animate={{ rotate: 0 }}
          whileHover={{ rotate: 45 }}
          transition={{ duration: 0.2 }}
          className={`ml-2 shrink-0 rounded-full p-1.5 opacity-60 transition-opacity group-hover:opacity-100 ${style.textClass}`}
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
          className={`btn btn-ghost min-h-10 px-3 py-2 text-sm ${style.textClass}`}
          whileHover={{ x: 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          aria-label={`Visit ${resource.title}`}
        >
          <span>Visit</span>
          <motion.div
            initial={{ x: 0 }}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            <Play size={12} />
          </motion.div>
        </motion.a>
      </div>
    </motion.article>
  );
};

// Section Header Component
const SectionHeader = ({ title, description, sectionType }: { title: string; description: string; sectionType: ResourceSection['sectionType'] }) => {
  const style = getSectionStyleConfig(sectionType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 sm:mb-8"
    >
      <div className="flex items-center gap-3">
        <div className={`flex size-10 shrink-0 items-center justify-center rounded-control border ${style.iconClass}`}>
          {style.icon}
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
  return (
    <div className="space-y-12 sm:space-y-16">
      {resourceSections.map((section, sectionIndex) => (
        <section key={sectionIndex}>
          <SectionHeader
            title={section.title}
            description={section.description}
            sectionType={section.sectionType}
          />

          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
            {section.resources.map((resource, resourceIndex) => (
              <ResourceItem
                key={resourceIndex}
                resource={resource}
                index={resourceIndex}
                sectionType={section.sectionType}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ResourceDisplay;
