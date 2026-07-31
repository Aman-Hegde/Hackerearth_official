import type { FC } from 'react';
import type { BlogPost } from '../lib/resourcesData';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

interface ResourceCardProps {
  post: BlogPost;
  isDark: boolean;
  className?: string;
}

const categoryAccentStyles: Record<
  BlogPost['category'],
  { card: string; topBorder: string; chip: string; link: string }
> = {
  web: {
    card: 'border-technical/25 hover:border-technical/45',
    topBorder: 'top-border-accent-cyan',
    chip: 'border-technical/25 bg-technical/10 text-technical-text',
    link: 'text-technical-text'
  },
  dsa: {
    card: 'border-creative/25 hover:border-creative/45',
    topBorder: 'top-border-accent-violet',
    chip: 'border-creative/25 bg-creative/10 text-creative-text',
    link: 'text-creative-text'
  },
  aptitude: {
    card: 'border-highlight/25 hover:border-highlight/45',
    topBorder: 'top-border-accent-amber',
    chip: 'border-highlight/25 bg-highlight/10 text-highlight-text',
    link: 'text-highlight-text'
  },
  general: {
    card: 'border-primary/25 hover:border-primary/45',
    topBorder: 'top-border-accent-primary',
    chip: 'border-primary/25 bg-primary/10 text-primary-text',
    link: 'text-primary-text'
  }
};

const ResourceCard: FC<ResourceCardProps> = ({ post, isDark, className = '' }) => {
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
        ease: [0.16, 1, 0.3, 1]
      }}
      viewport={{ once: true, amount: 0.2 }}
      className={`ui-card flex h-full min-w-0 flex-col overflow-hidden transition-colors duration-300 hover:shadow-surface ${accent.card} ${accent.topBorder} ${className}`}
      data-color-scheme={isDark ? 'dark' : 'light'}
    >
      <div className="flex h-full flex-col p-5 sm:p-6">
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
            <span className="inline-flex items-center rounded-full border border-line bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-muted">
              {post.level}
            </span>
            <span className="inline-flex items-center rounded-full border border-line bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-muted">
              {getTypeIcon(post.type)} {post.type}
            </span>
            {post.week && (
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary-text">
                Week {post.week}
              </span>
            )}
          </div>
        </div>

        <h2 className="mt-5 font-display text-2xl font-semibold leading-tight text-ink">
          <Link
            to={`/domains/${post.slug}`}
            className={`transition-colors hover:underline hover:underline-offset-4 focus-visible:outline-offset-4 ${accent.link}`}
          >
            {post.title}
          </Link>
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          {post.description}
        </p>

        <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to={`/domains/${post.slug}`}
            className={`group/read inline-flex min-h-11 items-center gap-1 py-2 font-semibold transition-colors hover:underline hover:underline-offset-4 focus-visible:outline-offset-2 ${accent.link}`}
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
