import type { FC } from 'react';
import type { BlogPost } from '../lib/resourcesData';
import { Link } from 'react-router-dom';

interface ResourceCardProps {
  post: BlogPost;
  isDark: boolean;
  className?: string;
}

const ResourceCard: FC<ResourceCardProps> = ({ post, isDark, className = '' }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'web': return 'border-brand-500/20 bg-brand-500/10 text-brand-700 dark:text-brand-300';
      case 'dsa': return 'border-signal-500/20 bg-signal-500/10 text-signal-700 dark:text-signal-300';
      case 'aptitude': return 'border-accent-500/20 bg-accent-500/10 text-accent-700 dark:text-accent-300';
      case 'system-design': return 'border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-300';
      default: return 'border-line bg-surface-muted text-ink-muted';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'border-signal-500/20 bg-signal-500/10 text-signal-700 dark:text-signal-300';
      case 'intermediate': return 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300';
      case 'advanced': return 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300';
      default: return 'border-line bg-surface-muted text-ink-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube': return '\uD83C\uDFAC';
      case 'article': return '\uD83D\uDCDA';
      case 'documentation': return '\uD83D\uDCC4';
      default: return '\uD83D\uDD17';
    }
  };

  return (
    <article
      className={`ui-card-interactive flex h-full min-w-0 flex-col overflow-hidden ${className}`}
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
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getCategoryColor(post.category)}`}>
              {post.category === 'web' ? 'Web Development' :
               post.category === 'dsa' ? 'Data Structures and Algorithms' :
               post.category === 'aptitude' ? 'Aptitude' : 'System Design'}
            </span>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getLevelColor(post.level)}`}>
              {post.level}
            </span>
            <span className="inline-flex items-center rounded-full border border-line bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-muted">
              {getTypeIcon(post.type)} {post.type}
            </span>
            {post.week && (
              <span className="inline-flex items-center rounded-full border border-brand-500/20 bg-brand-500/10 px-2.5 py-1 text-xs font-medium text-brand-700 dark:text-brand-300">
                Week {post.week}
              </span>
            )}
          </div>
        </div>

        <h2 className="mt-5 font-display text-2xl font-semibold leading-tight text-ink">
          <Link
            to={`/domains/${post.slug}`}
            className="transition-colors hover:text-brand-700 focus-visible:outline-offset-4 dark:hover:text-brand-300"
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
            className="font-semibold text-brand-700 transition-colors hover:text-brand-800 focus-visible:outline-offset-2 dark:text-brand-300 dark:hover:text-brand-200"
            aria-label={`Read more: "${post.title}"`}
          >
            Read more &rarr;
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-subtle">
            <span>{post.readTime}</span>
            <span>&bull;</span>
            <span>{post.author.name}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ResourceCard;
