import React from 'react';
import { categories } from '../lib/resourcesData';

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isDark: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  activeCategory, 
  onCategoryChange, 
  isDark 
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeCategory === category.id
              ? 'bg-blue-600 text-white shadow-lg'
              : `${
                  isDark 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`
          }`}
        >
          {category.name}
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            activeCategory === category.id
              ? 'bg-blue-500 text-white'
              : isDark
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-200 text-gray-600'
          }`}>
            {category.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;