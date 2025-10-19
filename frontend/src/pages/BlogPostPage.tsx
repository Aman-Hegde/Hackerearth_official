import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../lib/resourcesData';
import { useTheme } from '../context/ThemeContext';
import ResourceDisplay from '../components/ResourceDisplay';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isDark } = useTheme();

  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        isDark ? "bg-black" : "bg-white"
      }`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0 py-16">
          <h1 className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            Post not found
          </h1>
          <Link to="/domains" className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
            &larr; Back to resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark ? "bg-black" : "bg-white"
    }`}>
      <div className="max-w-4xl px-4 mx-auto sm:px-6 xl:px-0">
        {/* Back to blog */}
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <Link 
            to="/domains"
            className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
          >
            &larr; Back to blog
          </Link>
        </div>

        <article>
          <div className={`xl:divide-y ${
            isDark ? "xl:divide-gray-800" : "xl:divide-gray-200"
          }`}>
            <header className="pt-6 xl:pb-6">
              <div className="space-y-1 text-center">
                <dl className="space-y-10">
                  <div>
                    <dt className="sr-only">Published on</dt>
                    <dd className={`text-base font-medium leading-6 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}>
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </dd>
                  </div>
                </dl>
                <div>
                  <h1 className={`pb-2 text-center text-4xl font-semibold tracking-tighter md:text-[54px] md:leading-[60px] ${
                    isDark 
                      ? "bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-transparent" 
                      : "text-gray-900"
                  }`}>
                    {post.title}
                  </h1>
                </div>
              </div>
            </header>

            <div className={`grid-rows-[auto_1fr] divide-y pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 ${
              isDark ? "divide-gray-800" : "divide-gray-200"
            }`}>
              {/* Author sidebar */}
              <dl className={`pb-10 pt-6 xl:border-b xl:pt-11 ${
                isDark ? "xl:border-gray-800" : "xl:border-gray-200"
              }`}>
                <dt className="sr-only">Authors</dt>
                <dd>
                  <ul className="flex flex-wrap justify-center gap-8 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                    <li className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                        {post.author.name.charAt(0)}
                      </div>
                      <dl className="whitespace-nowrap text-sm font-medium leading-5">
                        <dt className="sr-only">Name</dt>
                        <dd className={isDark ? "text-white" : "text-gray-900"}>{post.author.name}</dd>
                        <dt className="sr-only">Source</dt>
                        <dd>
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            {post.source}
                          </a>
                        </dd>
                      </dl>
                    </li>
                  </ul>
                </dd>
              </dl>

              {/* Main content */}
              <div className={`divide-y xl:col-span-3 xl:row-span-2 xl:pb-0 ${
                isDark ? "divide-gray-800" : "divide-gray-200"
              }`}>
                <div className={`prose max-w-none pb-8 pt-10 prose-lg ${
                  isDark ? "prose-invert" : ""
                }`}>
                  {/* Render the rich HTML content from the content field */}
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  
                  {/* Resource Display Section */}
                  {post.resourceSections && (
                    <div className="mt-12">
                      <ResourceDisplay resourceSections={post.resourceSections} />
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="pt-6 pb-6">
                  <h2 className={`text-xs uppercase tracking-wide mb-3 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}>
                    Tags
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 text-sm font-medium uppercase rounded-full ${
                          isDark 
                            ? "text-primary-400 bg-primary-900/30" 
                            : "text-primary-600 bg-primary-100"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;