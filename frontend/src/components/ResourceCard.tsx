import type { FC } from 'react';
import type { BlogPost } from '../lib/resourcesData';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

interface ResourceCardProps {
  post: BlogPost;
  isDark: boolean;
  className?: string;
  index?: number;
  headingLevel?: 'h2' | 'h3';
  detailSearch?: string;
  detailState?: { fromStudentDashboard: true };
}

const categoryAccentStyles: Record<
  BlogPost['category'],
  { card: string; topBorder: string; chip: string; link: string; cta: string; glow: string }
> = {
  web: {
    card: 'border-technical/25 hover:border-technical/50',
    topBorder: 'top-border-accent-cyan',
    chip: 'border-technical/25 bg-technical/10 text-technical-text',
    link: 'hover:text-technical-text',
    cta: 'border-technical/30 bg-technical/10 text-technical-text hover:bg-technical/20',
    glow: 'bg-technical/20'
  },
  dsa: {
    card: 'border-creative/25 hover:border-creative/50',
    topBorder: 'top-border-accent-violet',
    chip: 'border-creative/25 bg-creative/10 text-creative-text',
    link: 'hover:text-creative-text',
    cta: 'border-creative/30 bg-creative/10 text-creative-text hover:bg-creative/20',
    glow: 'bg-creative/20'
  },
  aptitude: {
    card: 'border-dream/25 hover:border-dream/50',
    topBorder: 'top-border-accent-primary',
    chip: 'border-dream/25 bg-dream/10 text-dream-text',
    link: 'hover:text-dream-text',
    cta: 'border-dream/30 bg-dream/10 text-dream-text hover:bg-dream/20',
    glow: 'bg-dream/20'
  },
  general: {
    card: 'border-rose/25 hover:border-rose/50',
    topBorder: 'top-border-accent-primary',
    chip: 'border-rose/25 bg-rose/10 text-rose-text',
    link: 'hover:text-rose-text',
    cta: 'border-rose/30 bg-rose/10 text-rose-text hover:bg-rose/20',
    glow: 'bg-rose/20'
  }
};

const ResourceCard: FC<ResourceCardProps> = ({
  post,
  isDark,
  className = '',
  index = 0,
  headingLevel: Heading = 'h2',
  detailSearch = '',
  detailState,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const accent = categoryAccentStyles[post.category] || categoryAccentStyles.general;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube': return '\uD83C\uDFAC';
      case 'article': return '\uD83D\uDCDA';
      case 'documentation': return '\uD83D\uDCC4';
      default: return '\uD83D\uDD17';
    }
  };

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.5,
        delay: shouldReduceMotion ? 0 : Math.min(index * 0.045, 0.22),
        ease: [0.16, 1, 0.3, 1]
      }}
      viewport={{ once: true, amount: 0.2 }}
      className={`ui-card-glass group/card relative flex h-full min-w-0 flex-col overflow-hidden transition duration-300 ease-out-expo hover:scale-[1.012] hover:shadow-glow motion-reduce:transform-none motion-reduce:transition-none ${accent.card} ${accent.topBorder} ${className}`}
      data-color-scheme={isDark ? 'dark' : 'light'}
    >
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-16 -top-16 size-40 rounded-full opacity-70 blur-3xl ${accent.glow}`}
      />
      <div className="relative flex h-full flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd className="font-mono text-xs font-medium text-ink-subtle">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </dd>
          </dl>

          <div className="flex flex-wrap justify-end gap-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${accent.chip}`}>
              {post.category === 'web' ? 'Web Development' :
               post.category === 'dsa' ? 'Data Structures and Algorithms' :
               post.category === 'aptitude' ? 'Aptitude' : 'System Design'}
            </span>
            <span className="inline-flex items-center rounded-full border border-line bg-surface-muted/80 px-2.5 py-1 text-xs font-medium text-ink-muted">
              {post.level}
            </span>
            <span className="inline-flex items-center rounded-full border border-line bg-surface-muted/80 px-2.5 py-1 text-xs font-medium capitalize text-ink-muted">
              {getTypeIcon(post.type)} {post.type}
            </span>
            {post.week && (
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary-text">
                Week {post.week}
              </span>
            )}
          </div>
        </div>

        <Heading className="mt-5 break-words font-display text-2xl font-semibold leading-tight text-ink">
          <Link
            to={`/domains/${post.slug}${detailSearch}`}
            state={detailState}
            className={`transition-colors duration-200 hover:underline hover:underline-offset-4 focus-visible:outline-offset-4 motion-reduce:transition-none ${accent.link}`}
          >
            {post.title}
          </Link>
        </Heading>

        <p className="mt-4 break-words text-sm leading-relaxed text-ink-muted">
          {post.description}
        </p>

        <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={`/domains/${post.slug}${detailSearch}`}
            state={detailState}
            className={`group/read inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-offset-2 motion-reduce:transition-none ${accent.cta}`}
            aria-label={`Read more: "${post.title}"`}
          >
            <span>Read more</span>
            <span
              className={`transition-transform duration-200 ${
                shouldReduceMotion ? '' : 'group-hover/read:translate-x-0.5'
              }`}
              aria-hidden="true"
            >
              &rarr;
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-subtle">
            <span>{post.readTime}</span>
            <span>&bull;</span>
            <span>{post.author.name}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ResourceCard;
