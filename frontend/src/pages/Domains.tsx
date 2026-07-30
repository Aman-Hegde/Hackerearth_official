import type { FC } from 'react';
import { useState } from 'react';
import { blogPosts } from '../lib/resourcesData';
import ResourceCard from '../components/ResourceCard';
import CategoryFilter from '../components/CategoryFilter';
import WeekFilter from '../components/WeekTabs';
import { useTheme } from '../context/ThemeContext';

const BlogPage: FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeWeek, setActiveWeek] = useState(0);
  const { isDark } = useTheme();

  const filteredPosts = blogPosts.filter(post => {
    const categoryMatch = activeCategory === 'all' || post.category === activeCategory;
    const weekMatch = activeWeek === 0 || post.week === activeWeek;
    return categoryMatch && weekMatch;
  });

  return (
    <main
      className="min-h-screen bg-canvas text-ink transition-colors duration-500"
      data-color-scheme={isDark ? 'dark' : 'light'}
    >
      <div className="site-container-wide section-space pt-24 lg:pt-section">
        {/* Header */}
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="section-heading">Learning Resources</h1>
          <p className="section-lead mx-auto">
            Curated tutorials, articles, and resources organized by week and category
          </p>
        </header>

        <section className="ui-card-muted mt-10 space-y-4 overflow-hidden p-4 sm:mt-12 sm:p-6" aria-label="Resource filters">
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
            />
          </div>
        </section>

        {/* Results Count */}
        <div className="my-6 text-sm font-medium text-ink-muted" aria-live="polite">
          Showing {filteredPosts.length} of {blogPosts.length} resources
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
              <ResourceCard key={post.id} post={post} isDark={isDark} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default BlogPage;
