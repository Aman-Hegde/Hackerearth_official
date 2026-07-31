import type { FC } from 'react';
import { categories } from '../lib/resourcesData';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isDark: boolean;
}

const activeCategoryStyles: Record<string, { button: string; count: string }> = {
  all: {
    button: 'border-primary bg-primary/5 text-primary-text shadow-soft',
    count: 'border-primary/25 bg-surface text-primary-text'
  },
  web: {
    button: 'border-technical bg-technical/5 text-technical-text shadow-soft',
    count: 'border-technical/25 bg-surface text-technical-text'
  },
  dsa: {
    button: 'border-creative bg-creative/5 text-creative-text shadow-soft',
    count: 'border-creative/25 bg-surface text-creative-text'
  },
  aptitude: {
    button: 'border-highlight bg-highlight/5 text-highlight-text shadow-soft',
    count: 'border-highlight/25 bg-surface text-highlight-text'
  }
};

const CategoryFilter: FC<CategoryFilterProps> = ({
  activeCategory,
  onCategoryChange,
  isDark
}) => {
  return (
    <div
      className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      data-color-scheme={isDark ? 'dark' : 'light'}
    >
      <div className="flex min-w-max gap-2" role="group" aria-label="Filter resources by category">
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
                ? `btn min-h-11 shrink-0 rounded-full border-2 px-3 py-2 text-xs sm:px-4 sm:text-sm ${activeStyle.button}`
                : 'btn btn-secondary min-h-11 shrink-0 rounded-full px-3 py-2 text-xs sm:px-4 sm:text-sm'
              }
            >
              <span>{category.name}</span>
              <span
                className={isActive
                  ? `rounded-full border px-2 py-0.5 text-xs font-semibold ${activeStyle.count}`
                  : 'rounded-full border border-line bg-surface-muted px-2 py-0.5 text-xs text-ink-muted'
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
