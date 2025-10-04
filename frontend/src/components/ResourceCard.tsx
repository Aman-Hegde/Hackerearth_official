import React from 'react';
import { BlogPost } from '../lib/resourcesData';
import { Link } from 'react-router-dom';

interface ResourceCardProps {
  post: BlogPost;
  isDark: boolean;
  className?: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ post, isDark }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'web': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'dsa': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'aptitude': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'system-design': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube': return '🎬';
      case 'article': return '📚';
      case 'documentation': return '📄';
      default: return '🔗';
    }
  };

  return (
    <article className={`group py-6 transition-all duration-300 ${
      isDark ? "border-gray-800" : "border-gray-200"
    }`}>
      <div className={`space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0 p-6 rounded-2xl ${
        isDark ? "bg-black" : "bg-white"  // CHANGED HERE - added background colors
      }`}>
        <dl>
          <dt className="sr-only">Published on</dt>
          <dd className={`text-base font-medium leading-6 ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </dd>
        </dl>
        
        <div className="space-y-5 xl:col-span-3">
          <div className="space-y-6">
            <div>
              <h2 className={`text-2xl font-bold leading-8 tracking-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                <Link 
                  to={`/domains/${post.slug}`}
                  className="transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {post.title}
                </Link>
              </h2>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                  {post.category === 'web' ? 'Web Development' : 
                   post.category === 'dsa' ? 'Data Structures and Algorithms' : 
                   post.category === 'aptitude' ? 'Aptitude' : 'System Design'}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(post.level)}`}>
                  {post.level}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {getTypeIcon(post.type)} {post.type}
                </span>
                {post.week && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    Week {post.week}
                  </span>
                )}
              </div>
            </div>
            
            <div className={`prose max-w-none ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              {post.description}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-base font-medium leading-6">
            <Link 
              to={`/domains/${post.slug}`}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              aria-label={`Read more: "${post.title}"`}
            >
              Read more &rarr;
            </Link>
            
            <div className={`flex items-center space-x-2 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}>
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{post.author.name}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ResourceCard;