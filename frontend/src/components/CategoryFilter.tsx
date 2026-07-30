import type { FC } from 'react';
import { categories } from '../lib/resourcesData';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isDark: boolean;
}

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
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              aria-pressed={isActive}
              className={isActive
                ? 'btn btn-primary min-h-10 shrink-0 rounded-full px-3 py-2 text-xs sm:min-h-11 sm:px-4 sm:text-sm'
                : 'btn btn-secondary min-h-10 shrink-0 rounded-full px-3 py-2 text-xs sm:min-h-11 sm:px-4 sm:text-sm'
              }
            >
              <span>{category.name}</span>
              <span
                className={isActive
                  ? 'rounded-full border border-current/20 bg-white/20 px-2 py-0.5 text-xs'
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
