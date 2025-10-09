import React, { useState } from 'react';
import { blogPosts } from '../lib/resourcesData';
import ResourceCard from '../components/ResourceCard';
import CategoryFilter from '../components/CategoryFilter';
import WeekFilter from '../components/WeekTabs';
import { useTheme } from '../context/ThemeContext';

const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeWeek, setActiveWeek] = useState(0);
  const { isDark } = useTheme();

  const filteredPosts = blogPosts.filter(post => {
    const categoryMatch = activeCategory === 'all' || post.category === activeCategory;
    const weekMatch = activeWeek === 0 || post.week === activeWeek;
    return categoryMatch && weekMatch;
  });

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark ? "bg-black" : "bg-white"
    }`}>
      {/* Background pattern for dark mode */}
      {isDark && (
        <div className="fixed inset-0 opacity-5 pointer-events-none z-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.07) 0%, transparent 50%), radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
      )}
      
      <div className="relative pt-6 pb-16 z-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 mt-16">
            <h1 className={`mt-5 mb-4 pb-2 text-center text-4xl font-semibold tracking-tighter md:text-[54px] md:leading-[60px] ${
              isDark 
                ? "bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent" 
                : "text-gray-900"
            }`}>
              Learning Resources
            </h1>
            <p className={`mt-3 max-w-2xl mx-auto text-xl ${
              isDark ? "text-gray-300" : "text-gray-500"
            } sm:mt-4`}>
              Curated tutorials, articles, and resources organized by week and category
            </p>
          </div>

          {/* Week Filter */}
          <WeekFilter 
            activeWeek={activeWeek}
            onWeekChange={setActiveWeek}
            isDark={isDark}
          />

          {/* Category Filter */}
          <CategoryFilter 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            isDark={isDark}
          />

          {/* Results Count */}
          <div className={`mb-8 text-sm ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}>
            Showing {filteredPosts.length} of {blogPosts.length} resources
            {activeWeek > 0 && ` • Week ${activeWeek}`}
            {activeCategory !== 'all' && ` • ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
          </div>

          {/* Blog Posts */}
          <div className={`divide-y ${
            isDark ? "divide-gray-800" : "divide-gray-200"
          }`}>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">🔍</div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-900"
                }`}>
                  No resources found
                </h3>
                <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                  Try adjusting your filters to see more resources.
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <ResourceCard key={post.id} post={post} isDark={isDark} />
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
export default BlogPage;