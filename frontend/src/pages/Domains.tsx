import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers3 } from 'lucide-react';
import { blogPosts, categories } from '../lib/resourcesData';
import ResourceCard from '../components/ResourceCard';
import CategoryFilter from '../components/CategoryFilter';
import WeekFilter from '../components/WeekTabs';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/ui/PageTransition';
import SectionReveal from '../components/ui/SectionReveal';
import {
  getEnrolledResourceCategories,
  isStudentResourceOrigin,
  studentResourceSearch,
  studentResourceState,
} from '../lib/studentResources';

const BlogPage: FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeWeek, setActiveWeek] = useState(0);
  const { isDark } = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  const isStudent = user?.role === 'student';
  const fromStudentDashboard =
    isStudent && isStudentResourceOrigin(location.search, location.state);
  const enrolledCategories = useMemo(
    () => getEnrolledResourceCategories(user),
    [user],
  );
  const availablePosts = isStudent
    ? blogPosts.filter((post) => enrolledCategories.has(post.category))
    : blogPosts;
  const availableCategories = isStudent
    ? categories
        .filter((category) => category.id === 'all' || enrolledCategories.has(category.id as typeof blogPosts[number]['category']))
        .map((category) => ({
          ...category,
          count: category.id === 'all'
            ? availablePosts.length
            : availablePosts.filter((post) => post.category === category.id).length,
        }))
    : categories;

  const filteredPosts = availablePosts.filter(post => {
    const categoryMatch = activeCategory === 'all' || post.category === activeCategory;
    const weekMatch = activeWeek === 0 || post.week === activeWeek;
    return categoryMatch && weekMatch;
  });

  return (
    <PageTransition>
      <main
        className="relative isolate min-h-screen overflow-x-hidden bg-transparent text-ink transition-colors duration-300"
        data-color-scheme={isDark ? 'dark' : 'light'}
      >
        <div className="site-container-wide pb-section pt-24 sm:pt-28 lg:pt-32">
        {isStudent && (
          <Link
            to="/student/dashboard"
            className="ui-nav-glass group/back inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary-text transition duration-200 hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-offset-2 motion-reduce:transition-none"
          >
            <ArrowLeft
              className="size-4 transition-transform duration-200 group-hover/back:-translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
              aria-hidden="true"
            />
            Back to Student Dashboard
          </Link>
        )}
        <SectionReveal variant="fade" className={isStudent ? 'mt-6' : ''}>
          <header className="ui-panel-glass relative mx-auto max-w-5xl overflow-hidden px-5 py-10 text-center sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[12%] -top-24 h-48 rounded-full bg-dream/10"
            />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-dream/30 bg-dream/10 px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-dream-text">
                <BookOpen className="size-3.5" aria-hidden="true" />
                Domains &amp; learning library
              </span>
              <h1 className="section-heading mt-5">
                <span className="text-gradient-subtle">Learning Resources</span>
              </h1>
              <p className="section-lead mx-auto max-w-2xl">
                Curated tutorials, articles, and resources organized by week and category
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-surface/70 px-3 py-2">
                  <BookOpen className="size-4 text-rose-text" aria-hidden="true" />
                  {availablePosts.length} curated resources
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-surface/70 px-3 py-2">
                  <Layers3 className="size-4 text-technical-text" aria-hidden="true" />
                  {Math.max(availableCategories.length - 1, 0)} learning domains
                </span>
              </div>
            </div>
          </header>
        </SectionReveal>

        <SectionReveal delay={0.06} className="mt-8 sm:mt-10">
          <section
            className="ui-panel-glass overflow-hidden border-primary/20 p-4 sm:p-6 lg:p-7"
            aria-label="Resource filters"
          >
            <div>
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                Study week
              </p>
              <WeekFilter
                activeWeek={activeWeek}
                onWeekChange={setActiveWeek}
                isDark={isDark}
              />
            </div>

            <div className="mt-5 border-t border-line/80 pt-5">
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-ink-subtle">
                Learning domain
              </p>
              <CategoryFilter
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                isDark={isDark}
                categories={availableCategories}
              />
            </div>
          </section>
        </SectionReveal>

        {/* Results Count */}
        <div className="my-6 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
          <p className="rounded-full border border-line/80 bg-glass/70 px-3 py-2 text-sm font-medium text-ink-muted shadow-soft backdrop-blur-md">
            Showing <span className="font-semibold text-ink">{filteredPosts.length}</span> of {availablePosts.length} resources
            {activeWeek > 0 && " \u2022 Week " + activeWeek}
            {activeCategory !== 'all' && " \u2022 " + activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
          </p>
        </div>

        {/* Blog Posts */}
        {filteredPosts.length === 0 ? (
          <SectionReveal variant="fade">
            <div className="ui-panel-glass py-12 text-center sm:py-16">
              <div className="mb-4 text-5xl opacity-50" aria-hidden="true">{"\uD83D\uDD0D"}</div>
              <h2 className="font-display text-xl font-semibold text-ink">
                No resources found
              </h2>
              <p className="mt-2 text-ink-muted">
                Try adjusting your filters to see more resources.
              </p>
            </div>
          </SectionReveal>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:gap-6">
            {filteredPosts.map((post, index) => (
              <ResourceCard
                key={post.id}
                post={post}
                isDark={isDark}
                index={index}
                detailSearch={fromStudentDashboard ? studentResourceSearch : undefined}
                detailState={fromStudentDashboard ? studentResourceState : undefined}
              />
            ))}
          </div>
        )}
      </div>
      </main>
    </PageTransition>
  );
};

export default BlogPage;
