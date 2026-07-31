import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { blogPosts, type BlogPost } from '../lib/resourcesData';
import { useTheme } from '../context/ThemeContext';
import ResourceDisplay from '../components/ResourceDisplay';

const categoryPresentation: Record<BlogPost['category'], {
  glow: string;
  topBorder: string;
  text: string;
  chip: string;
  icon: string;
}> = {
  web: {
    glow: 'section-glow-cyan',
    topBorder: 'top-border-accent-cyan',
    text: 'text-technical-text',
    chip: 'border-technical/40 bg-technical/5 text-technical-text',
    icon: 'border-technical/30 bg-technical/10 text-technical-text'
  },
  dsa: {
    glow: 'section-glow-violet',
    topBorder: 'top-border-accent-violet',
    text: 'text-creative-text',
    chip: 'border-creative/40 bg-creative/5 text-creative-text',
    icon: 'border-creative/30 bg-creative/10 text-creative-text'
  },
  aptitude: {
    glow: 'section-glow-amber',
    topBorder: 'top-border-accent-amber',
    text: 'text-highlight-text',
    chip: 'border-highlight/40 bg-highlight/5 text-highlight-text',
    icon: 'border-highlight/30 bg-highlight/10 text-highlight-text'
  },
  general: {
    glow: 'section-glow-subtle',
    topBorder: 'top-border-accent-primary',
    text: 'text-primary-text',
    chip: 'border-primary/40 bg-primary/5 text-primary-text',
    icon: 'border-primary/30 bg-primary/10 text-primary-text'
  }
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion() ?? false;

  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <main
        className="section-glow-subtle min-h-screen overflow-x-hidden bg-canvas text-ink transition-colors duration-500"
        data-color-scheme={isDark ? 'dark' : 'light'}
      >
        <div className="site-container pb-section pt-28 sm:pt-32">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: 0,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="ui-card top-border-accent-primary mx-auto max-w-2xl p-6 text-center sm:p-10"
          >
            <h1 className="font-display text-title text-ink">Post not found</h1>
            <Link to="/domains" className="btn btn-secondary mt-6">
              &larr; Back to resources
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  const accent = categoryPresentation[post.category] || categoryPresentation.general;

  return (
    <main
      className={`${accent.glow} min-h-screen overflow-x-hidden bg-canvas text-ink transition-colors duration-500`}
      data-color-scheme={isDark ? 'dark' : 'light'}
    >
      <div className="site-container-wide pb-section pt-28 sm:pt-32">
        <div className="mx-auto max-w-5xl">
          {/* Back to blog */}
          <motion.nav
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              delay: 0,
              ease: [0.16, 1, 0.3, 1]
            }}
            aria-label="Resource navigation"
          >
            <Link to="/domains" className="btn btn-secondary">
              &larr; Back to blog
            </Link>
          </motion.nav>

          <article className="mt-8 sm:mt-10">
            <motion.header
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.5,
                delay: shouldReduceMotion ? 0 : 0.04,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={`${accent.topBorder} border-b border-line pb-8 pt-6 text-center sm:pb-10`}
            >
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-ink-muted">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="font-mono font-medium">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </dd>
                </dl>
                <span aria-hidden="true">&bull;</span>
                <span className={`rounded-full border px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.1em] ${accent.chip}`}>
                  {post.category}
                </span>
                {post.week && (
                  <span className="rounded-full border border-line bg-surface-muted px-2.5 py-1 font-mono text-xs font-semibold text-ink-muted">
                    Week {post.week}
                  </span>
                )}
              </div>

              <h1 className={`section-heading mx-auto mt-5 max-w-4xl ${accent.text}`}>
                {post.title}
              </h1>
              <p className="section-lead mx-auto">
                {post.description}
              </p>
            </motion.header>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.5,
                delay: shouldReduceMotion ? 0 : 0.08,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="mt-8 grid min-w-0 items-start gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10"
            >
              {/* Author sidebar */}
              <aside className={`ui-card p-5 lg:sticky lg:top-28 ${accent.topBorder}`} aria-label="Resource author and source">
                <dl>
                  <dt className="sr-only">Authors</dt>
                  <dd>
                    <ul>
                      <li className="flex items-center gap-3">
                        <div className={`flex size-11 shrink-0 items-center justify-center rounded-full border text-sm font-bold shadow-soft ${accent.icon}`}>
                          {post.author.name.charAt(0)}
                        </div>
                        <dl className="min-w-0 text-sm font-medium leading-5">
                          <dt className="sr-only">Name</dt>
                          <dd className="break-words text-ink">{post.author.name}</dd>
                          <dt className="sr-only">Source</dt>
                          <dd className="mt-1">
                            <a
                              href={post.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`break-words font-semibold underline underline-offset-4 transition-colors focus-visible:outline-offset-2 ${accent.text}`}
                            >
                              {post.source}
                            </a>
                          </dd>
                        </dl>
                      </li>
                    </ul>
                  </dd>
                </dl>
              </aside>

              {/* Main content */}
              <div className="min-w-0">
                <div className={isDark
                  ? "prose prose-lg mx-auto min-w-0 max-w-reading break-words prose-invert"
                  : "prose prose-lg mx-auto min-w-0 max-w-reading break-words"
                }>
                  {/* Render the rich HTML content from the content field */}
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Resource Display Section */}
                {post.resourceSections && (
                  <div className={`mt-12 pt-10 ${accent.topBorder}`}>
                    <ResourceDisplay resourceSections={post.resourceSections} />
                  </div>
                )}

                {/* Tags */}
                <div className="mt-10 border-t border-line pt-6">
                  <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                    Tags
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full border px-3 py-1 text-sm font-medium uppercase ${accent.chip}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </article>
        </div>
      </div>
    </main>
  );
};

export default BlogPostPage;
