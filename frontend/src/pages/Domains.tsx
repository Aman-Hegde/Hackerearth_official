import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { blogPosts, categories } from '../lib/resourcesData';
import ResourceCard from '../components/ResourceCard';
import CategoryFilter from '../components/CategoryFilter';
import WeekFilter from '../components/WeekTabs';
import { useTheme } from '../context/ThemeContext';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
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
  const shouldReduceMotion = useReducedMotion();

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
    <main
      className="section-glow-subtle min-h-screen bg-canvas text-ink transition-colors duration-500"
      data-color-scheme={isDark ? 'dark' : 'light'}
    >
      <div className="site-container-wide section-space pt-24 lg:pt-section">
        {isStudent && (
          <Link
            to="/student/dashboard"
            className="group/back inline-flex min-h-11 items-center gap-2 rounded-control px-2 py-2 text-sm font-semibold text-primary-text transition-colors hover:bg-primary/10 focus-visible:outline-offset-2"
          >
            <ArrowLeft
              className="size-4 transition-transform duration-200 group-hover/back:-translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
              aria-hidden="true"
            />
            Back to Student Dashboard
          </Link>
        )}
        {/* Header */}
        <motion.header
          className={`mx-auto max-w-3xl text-center ${isStudent ? 'mt-5' : ''}`}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <h1 className="section-heading">
            <span className="text-gradient-subtle">Learning Resources</span>
          </h1>
          <p className="section-lead mx-auto">
            Curated tutorials, articles, and resources organized by week and category
          </p>
        </motion.header>

        <motion.section
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            delay: shouldReduceMotion ? 0 : 0.04,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="ui-card-muted top-border-accent-primary mt-10 space-y-4 overflow-hidden border-primary/20 p-4 sm:mt-12 sm:p-6"
          aria-label="Resource filters"
        >
          {/* Week Filter */}
          <WeekFilter
            activeWeek={activeWeek}
            onWeekChange={setActiveWeek}
            isDark={isDark}
          />

          <div className="border-t border-line pt-4">
            {/* Category Filter */}
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              isDark={isDark}
              categories={availableCategories}
            />
          </div>
        </motion.section>

        {/* Results Count */}
        <div className="my-6 text-sm font-medium text-ink-muted" aria-live="polite">
          Showing {filteredPosts.length} of {availablePosts.length} resources
          {activeWeek > 0 && " \u2022 Week " + activeWeek}
          {activeCategory !== 'all' && " \u2022 " + activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
        </div>

        {/* Blog Posts */}
        {filteredPosts.length === 0 ? (
          <div className="ui-card-muted py-12 text-center sm:py-16">
            <div className="mb-4 text-5xl opacity-50" aria-hidden="true">{"\uD83D\uDD0D"}</div>
            <h2 className="font-display text-xl font-semibold text-ink">
              No resources found
            </h2>
            <p className="mt-2 text-ink-muted">
              Try adjusting your filters to see more resources.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:gap-6">
            {filteredPosts.map((post) => (
              <ResourceCard
                key={post.id}
                post={post}
                isDark={isDark}
                detailSearch={fromStudentDashboard ? studentResourceSearch : undefined}
                detailState={fromStudentDashboard ? studentResourceState : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default BlogPage;
