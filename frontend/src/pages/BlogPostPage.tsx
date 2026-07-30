import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../lib/resourcesData';
import { useTheme } from '../context/ThemeContext';
import ResourceDisplay from '../components/ResourceDisplay';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isDark } = useTheme();

  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <main
        className="min-h-screen bg-canvas text-ink transition-colors duration-500"
        data-color-scheme={isDark ? 'dark' : 'light'}
      >
        <div className="site-container pb-section pt-28 sm:pt-32">
          <div className="ui-card mx-auto max-w-2xl p-6 text-center sm:p-10">
            <h1 className="font-display text-title text-ink">Post not found</h1>
            <Link to="/domains" className="btn btn-secondary mt-6">
              &larr; Back to resources
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-canvas text-ink transition-colors duration-500"
      data-color-scheme={isDark ? 'dark' : 'light'}
    >
      <div className="site-container-wide pb-section pt-28 sm:pt-32">
        <div className="mx-auto max-w-5xl">
          {/* Back to blog */}
          <nav aria-label="Resource navigation">
            <Link to="/domains" className="btn btn-secondary">
              &larr; Back to blog
            </Link>
          </nav>

          <article className="mt-8 sm:mt-10">
            <header className="border-b border-line pb-8 text-center sm:pb-10">
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
                <span className="rounded-full border border-line bg-surface-muted px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-brand-700 dark:text-brand-300">
                  {post.category}
                </span>
                {post.week && (
                  <span className="rounded-full border border-line bg-surface-muted px-2.5 py-1 font-mono text-xs font-semibold text-ink-muted">
                    Week {post.week}
                  </span>
                )}
              </div>

              <h1 className="section-heading mx-auto mt-5 max-w-4xl">
                {post.title}
              </h1>
              <p className="section-lead mx-auto">
                {post.description}
              </p>
            </header>

            <div className="mt-8 grid items-start gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
              {/* Author sidebar */}
              <aside className="ui-card p-5 lg:sticky lg:top-28" aria-label="Resource author and source">
                <dl>
                  <dt className="sr-only">Authors</dt>
                  <dd>
                    <ul>
                      <li className="flex items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white shadow-soft dark:bg-brand-400 dark:text-slate-950">
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
                              className="break-words text-brand-700 underline-offset-4 transition-colors hover:text-brand-800 hover:underline focus-visible:outline-offset-2 dark:text-brand-300 dark:hover:text-brand-200"
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
                  ? "prose prose-lg mx-auto max-w-reading prose-invert"
                  : "prose prose-lg mx-auto max-w-reading"
                }>
                  {/* Render the rich HTML content from the content field */}
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Resource Display Section */}
                {post.resourceSections && (
                  <div className="mt-12 border-t border-line pt-10">
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
                        className="rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-sm font-medium uppercase text-brand-700 dark:text-brand-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
};

export default BlogPostPage;
