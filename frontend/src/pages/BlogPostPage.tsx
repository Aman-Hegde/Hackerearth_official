import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';
import { blogPosts, type BlogPost } from '../lib/resourcesData';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ResourceDisplay from '../components/ResourceDisplay';
import PageTransition from '../components/ui/PageTransition';
import SectionReveal from '../components/ui/SectionReveal';
import {
  getEnrolledResourceCategories,
  isStudentResourceOrigin,
} from '../lib/studentResources';

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
  const location = useLocation();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const fromStudentDashboard =
    user?.role === 'student' && isStudentResourceOrigin(location.search, location.state);

  const post = blogPosts.find(p => p.slug === slug);
  const enrolledCategories = getEnrolledResourceCategories(user);
  const canViewStudentResource =
    !fromStudentDashboard || (post ? enrolledCategories.has(post.category) : false);

  if (!post || !canViewStudentResource) {
    return (
      <PageTransition>
        <main
          className="relative isolate min-h-screen overflow-x-hidden bg-transparent text-ink transition-colors duration-300"
          data-color-scheme={isDark ? 'dark' : 'light'}
        >
          <div className="site-container relative z-10 pb-section pt-28 sm:pt-32">
            <SectionReveal variant="fade">
              <div className="ui-panel-glass top-border-accent-primary mx-auto max-w-2xl p-6 text-center sm:p-10">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-rose/25 bg-rose/10 text-rose-text">
                  <BookOpen className="size-5" aria-hidden="true" />
                </div>
                <h1 className="mt-5 font-display text-title text-ink">
                  {post ? 'Resource unavailable' : 'Post not found'}
                </h1>
                {post && (
                  <p className="mt-3 text-sm leading-6 text-ink-muted">
                    This resource is outside your enrolled domains.
                  </p>
                )}
                <Link to="/domains" className="btn btn-secondary mt-6">
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back to Blog
                </Link>
              </div>
            </SectionReveal>
          </div>
        </main>
      </PageTransition>
    );
  }

  const accent = categoryPresentation[post.category] || categoryPresentation.general;

  return (
    <PageTransition>
      <main
        className={`${accent.glow} relative isolate min-h-screen overflow-x-hidden bg-transparent text-ink transition-colors duration-300`}
        data-color-scheme={isDark ? 'dark' : 'light'}
      >
        <div className="site-container-wide relative z-10 pb-section pt-28 sm:pt-32">
          {/* Back to blog */}
          <SectionReveal variant="fade">
            <nav aria-label="Resource navigation">
              <Link to="/domains" className="ui-nav-glass group/back inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary-text transition duration-200 hover:border-primary/40 hover:bg-primary/10 motion-reduce:transition-none">
                <ArrowLeft className="size-4 transition-transform duration-200 group-hover/back:-translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none" aria-hidden="true" />
                Back to Blog
              </Link>
            </nav>
          </SectionReveal>

          <article className="mt-8 sm:mt-10">
            <SectionReveal delay={0.04}>
              <header className={`ui-panel-glass ${accent.topBorder} relative overflow-hidden px-5 py-9 text-center sm:px-10 sm:py-12 lg:px-14`}>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[18%] -top-24 h-48 rounded-full bg-dream/10"
              />
              <div className="relative">
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
                  <span className="rounded-full border border-line bg-surface-muted/80 px-2.5 py-1 font-mono text-xs font-semibold text-ink-muted">
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
              </div>
              </header>
            </SectionReveal>

            <SectionReveal delay={0.08} className="mt-8 min-w-0">
              <div className={`ui-panel-glass min-w-0 overflow-hidden ${accent.topBorder}`}>
                <header className="border-b border-line/80 bg-surface-muted/60 p-5 sm:p-6" aria-label="Resource author and source">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                        Source
                      </p>
                      <div className="mt-3 flex min-w-0 items-center gap-3">
                        <div className={`flex size-11 shrink-0 items-center justify-center rounded-full border text-sm font-bold shadow-soft ${accent.icon}`}>
                          {post.author.name.charAt(0)}
                        </div>
                        <p className="min-w-0 break-words text-sm font-semibold text-ink">{post.author.name}</p>
                      </div>
                    </div>
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn min-h-11 rounded-full border border-line/80 bg-surface/80 px-4 py-2 text-sm font-semibold transition-colors hover:border-line-strong focus-visible:outline-offset-2 ${accent.text}`}
                    >
                      {post.source}
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                  </div>
                </header>

                <div className="w-full p-5 sm:p-7 lg:p-10">
                  <div className={isDark
                    ? "prose prose-lg mx-auto w-full min-w-0 max-w-reading break-words prose-invert"
                    : "prose prose-lg mx-auto w-full min-w-0 max-w-reading break-words"
                  }>
                    {/* Render the rich HTML content from the content field */}
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  </div>
                </div>
              </div>

              {/* Resource Display Section */}
              {post.resourceSections && (
                <div className="mt-12 w-full">
                  <ResourceDisplay resourceSections={post.resourceSections} />
                </div>
              )}

              {/* Tags */}
              <div className="ui-card-glass mt-10 w-full p-5 sm:p-6">
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
            </SectionReveal>
          </article>
        </div>
      </main>
    </PageTransition>
  );
};

export default BlogPostPage;
