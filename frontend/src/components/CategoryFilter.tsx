import type { FC } from 'react';
import { categories as allCategories } from '../lib/resourcesData';

type Category = (typeof allCategories)[number];

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isDark: boolean;
  categories?: Category[];
}

const activeCategoryStyles: Record<string, { button: string; count: string }> = {
  all: {
    button: 'border-primary/50 bg-primary/10 text-primary-text shadow-glow',
    count: 'border-primary/25 bg-surface/80 text-primary-text'
  },
  web: {
    button: 'border-technical/50 bg-technical/10 text-technical-text shadow-glow',
    count: 'border-technical/25 bg-surface/80 text-technical-text'
  },
  dsa: {
    button: 'border-creative/50 bg-creative/10 text-creative-text shadow-glow',
    count: 'border-creative/25 bg-surface/80 text-creative-text'
  },
  aptitude: {
    button: 'border-dream/50 bg-dream/10 text-dream-text shadow-glow',
    count: 'border-dream/25 bg-surface/80 text-dream-text'
  }
};

const CategoryFilter: FC<CategoryFilterProps> = ({
  activeCategory,
  onCategoryChange,
  isDark,
  categories = allCategories,
}) => {
  return (
    <div
      className="w-full"
      data-color-scheme={isDark ? 'dark' : 'light'}
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter resources by category">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const activeStyle = activeCategoryStyles[category.id] || activeCategoryStyles.all;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              aria-pressed={isActive}
              className={isActive
                ? `btn min-h-11 rounded-full border px-3 py-2 text-xs sm:px-4 sm:text-sm ${activeStyle.button}`
                : 'btn min-h-11 rounded-full border border-line/80 bg-glass/70 px-3 py-2 text-xs text-ink-muted shadow-soft backdrop-blur-md hover:border-line-strong hover:bg-surface sm:px-4 sm:text-sm'
              }
            >
              <span>{category.name}</span>
              <span
                className={isActive
                  ? `rounded-full border px-2 py-0.5 text-xs font-semibold ${activeStyle.count}`
                  : 'rounded-full border border-line bg-surface-muted/80 px-2 py-0.5 text-xs text-ink-muted'
                }
              >
                {category.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
