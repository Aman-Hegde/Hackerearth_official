export interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: 'web' | 'dsa' | 'aptitude' | 'general';
  level: 'beginner' | 'intermediate' | 'advanced';
  type: 'youtube' | 'article' | 'documentation';
  author: {
    name: string;
    avatar: string;
  };
  readTime: string;
  image: string;
  content: string;
  slug: string;
  week?: number;
  link: string;
  source: string;
}

// Helper function to create consistent content sections
const createContentSection = (title: string, content: string, isDark = false) => `
  <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">${title}</h3>
    <div class="text-gray-700 dark:text-gray-300 leading-relaxed">
      ${content}
    </div>
  </div>
`;

const createCodeBlock = (code: string, language = 'javascript') => `
  <div class="bg-gray-900 dark:bg-gray-950 p-4 rounded-lg border border-gray-700 dark:border-gray-600 mb-6">
    <pre class="text-sm text-gray-100 dark:text-gray-300 overflow-x-auto"><code class="language-${language}">${code}</code></pre>
  </div>
`;

const createFeatureList = (items: string[], isDark = false) => `
  <div class="grid gap-3 mb-6">
    ${items.map(item => `
      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="text-gray-700 dark:text-gray-300">${item}</div>
      </div>
    `).join('')}
  </div>
`;

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'HTML Forms, HTML5 Semantics, Forms & Flexbox',
    description: 'Learn to build modern web interfaces with HTML5 semantics, forms, and CSS Flexbox for responsive layouts.',
    date: '2025-08-25',
    tags: ['HTML5', 'Flexbox', 'CSS', 'Web Development'],
    category: 'web',
    level: 'beginner',
    type: 'youtube',
    author: {
      name: 'freeCodeCamp',
      avatar: '/avatars/fcc.jpg'
    },
    readTime: '10 min',
    image: '/blog/html-semantics.jpg',
    content: `
      ${createContentSection('Introduction', 'HTML forms and semantic elements are fundamental building blocks of modern web development. Understanding HTML5 semantic tags, form creation, and CSS Flexbox layout will help you build accessible, well-structured, and responsive web interfaces.')}
      
      ${createContentSection('HTML5 Semantic Elements', 'These elements provide meaning to your web content and improve accessibility:')}
      ${createFeatureList([
        '<code class="text-blue-600 dark:text-blue-400">&lt;header&gt;</code> - Contains introductory content and navigation',
        '<code class="text-blue-600 dark:text-blue-400">&lt;nav&gt;</code> - Defines navigation links and menus',
        '<code class="text-blue-600 dark:text-blue-400">&lt;main&gt;</code> - Specifies the main content of the document',
        '<code class="text-blue-600 dark:text-blue-400">&lt;article&gt;</code> - Represents independent, self-contained content',
        '<code class="text-blue-600 dark:text-blue-400">&lt;section&gt;</code> - Groups related content thematically'
      ])}
      
      ${createContentSection('CSS Flexbox Layout', 'Flexbox provides powerful one-dimensional layout capabilities:')}
      ${createCodeBlock(`.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.item {
  flex: 1;
  padding: 1rem;
}`, 'css')}
    `,
    slug: 'html5-semantics-flexbox',
    week: 1,
    link: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
    source: 'YouTube'
  },
  {
    id: '2',
    title: 'Data Structures & Algorithms Crash Course',
    description: 'Essential DSA concepts every developer should know with implementations and interview preparation tips.',
    date: '2024-01-12',
    tags: ['Algorithms', 'Data Structures', 'Interview'],
    category: 'dsa',
    level: 'intermediate',
    type: 'article',
    author: {
      name: 'GeeksforGeeks',
      avatar: '/avatars/geeksforgeeks.jpg'
    },
    readTime: '15 min',
    image: '/blog/dsa-crash-course.jpg',
    content: `
      ${createContentSection('Introduction', 'Data Structures and Algorithms (DSA) are the foundation of efficient software development. Understanding these core concepts will help you write optimized code and excel in technical interviews.')}
      
      ${createContentSection('Core Data Structures', 'Fundamental data structures for algorithmic problem-solving:')}
      ${createFeatureList([
        '<strong>Arrays</strong> - Fixed-size sequential collection of elements',
        '<strong>Linked Lists</strong> - Linear collection where elements point to next',
        '<strong>Stacks & Queues</strong> - LIFO and FIFO data structures',
        '<strong>Trees</strong> - Hierarchical data structure with nodes',
        '<strong>Hash Tables</strong> - Key-value pairs for fast lookups'
      ])}
      
      ${createContentSection('Binary Search Implementation', 'Efficient searching algorithm for sorted arrays:')}
      ${createCodeBlock(`function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}`, 'javascript')}
    `,
    slug: 'dsa-crash-course',
    week: 2,
    link: 'https://www.geeksforgeeks.org/data-structures/',
    source: 'GeeksforGeeks'
  },
  {
    id: '3',
    title: 'Advanced CSS, Flexbox, Grid & Responsive Design',
    description: 'Deep dive into modern CSS layout techniques including Flexbox, CSS Grid, and responsive design principles.',
    date: '2025-08-31',
    tags: ['CSS', 'Flexbox', 'Grid', 'Responsive Design'],
    category: 'web',
    level: 'intermediate',
    type: 'article',
    author: {
      name: 'MDN Web Docs',
      avatar: '/avatars/mdn.jpg'
    },
    readTime: '12 min',
    image: '/blog/advanced-css.jpg',
    content: `
      ${createContentSection('Introduction', 'Modern CSS has evolved far beyond basic styling. Advanced techniques like Flexbox, CSS Grid, and responsive design enable sophisticated, adaptive layouts.')}
      
      ${createContentSection('CSS Grid Layout', 'Two-dimensional layout system for complex designs:')}
      ${createCodeBlock(`.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
  gap: 1rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}`, 'css')}
      
      ${createContentSection('Flexbox Properties', 'Essential Flexbox properties for flexible layouts:')}
      ${createFeatureList([
        '<code>display: flex</code> - Creates flex container',
        '<code>justify-content</code> - Main axis alignment',
        '<code>align-items</code> - Cross axis alignment',
        '<code>flex-direction</code> - Direction of flex items',
        '<code>flex-wrap</code> - Controls item wrapping'
      ])}
    `,
    slug: 'advanced-css-layouts',
    week: 2,
    link: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    source: 'MDN Web Docs'
  },
  {
    id: '4',
    title: 'JavaScript DOM Manipulation & Events',
    description: 'Complete guide to JavaScript DOM manipulation, event handling, and dynamic content creation.',
    date: '2025-09-21',
    tags: ['JavaScript', 'DOM', 'Events', 'Web Development'],
    category: 'web',
    level: 'intermediate',
    type: 'article',
    author: {
      name: 'MDN Web Docs',
      avatar: '/avatars/mdn.jpg'
    },
    readTime: '8 min',
    image: '/blog/js-dom.jpg',
    content: `
      ${createContentSection('Introduction', 'The Document Object Model (DOM) is a programming interface for web documents. JavaScript DOM manipulation allows dynamic changes to content, structure, and styling.')}
      
      ${createContentSection('DOM Selection Methods', 'Various ways to select and target elements:')}
      ${createFeatureList([
        '<code>document.getElementById()</code> - Select by unique ID',
        '<code>document.querySelector()</code> - First matching CSS selector',
        '<code>document.querySelectorAll()</code> - All matching elements',
        '<code>document.getElementsByClassName()</code> - Select by class name'
      ])}
      
      ${createContentSection('Event Handling Example', 'Adding interactivity with event listeners:')}
      ${createCodeBlock(`// Add click event listener
document.getElementById('myButton').addEventListener('click', function() {
  // Toggle element visibility
  const element = document.getElementById('content');
  element.style.display = element.style.display === 'none' ? 'block' : 'none';
});

// Form submission handling
document.getElementById('myForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent default form submission
  const formData = new FormData(this);
  console.log('Form data:', Object.fromEntries(formData));
});`, 'javascript')}
    `,
    slug: 'javascript-dom-manipulation',
    week: 4,
    link: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model',
    source: 'MDN Web Docs'
  },
  {
    id: '5',
    title: 'JavaScript Fundamentals - Complete Learning Path',
    description: 'Master JavaScript from basics to advanced concepts with curated resources and practice exercises.',
    date: '2025-09-14',
    tags: ['JavaScript', 'ES6+', 'Async Programming', 'Web Development'],
    category: 'web',
    level: 'beginner',
    type: 'article',
    author: {
      name: 'Multiple Sources',
      avatar: '/avatars/js-learning.jpg'
    },
    readTime: '15 min',
    image: '/blog/javascript-fundamentals.jpg',
    content: `
      ${createContentSection('Introduction', 'JavaScript is the backbone of modern web development. This comprehensive path covers everything from basic syntax to advanced concepts for building interactive applications.')}
      
      ${createContentSection('Core JavaScript Concepts', 'Essential building blocks for JavaScript mastery:')}
      ${createFeatureList([
        '<strong>Variables & Data Types</strong> - let, const, primitives, type coercion',
        '<strong>Functions & Scope</strong> - Declarations, expressions, arrow functions, closures',
        '<strong>Asynchronous Programming</strong> - Callbacks, promises, async/await',
        '<strong>ES6+ Features</strong> - Modern syntax and capabilities',
        '<strong>DOM Manipulation</strong> - Dynamic content and event handling'
      ])}
      
      ${createContentSection('Modern JavaScript Example', 'ES6+ features and async patterns:')}
      ${createCodeBlock(`// Modern JavaScript Features
const getUserData = async (userId) => {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const data = await response.json();
    
    // Destructuring
    const { name, email, profile } = data;
    
    // Template literals
    console.log(\`User: \${name}, Email: \${email}\`);
    
    return { name, email, ...profile };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Usage
getUserData(123)
  .then(user => console.log('User data:', user))
  .catch(error => console.error('Failed:', error));`, 'javascript')}
    `,
    slug: 'javascript-fundamentals',
    week: 3,
    link: 'https://javascript.info',
    source: 'Multiple Sources'
  },
  {
    id: '6',
    title: 'Quantitative Aptitude Masterclass',
    description: 'Complete quantitative aptitude and logical reasoning course with shortcuts and placement strategies.',
    date: '2024-01-05',
    tags: ['Quantitative', 'Reasoning', 'Math', 'Placements'],
    category: 'aptitude',
    level: 'beginner',
    type: 'youtube',
    author: {
      name: 'CareerRide',
      avatar: '/avatars/careerride.jpg'
    },
    readTime: '20 min',
    image: '/blog/aptitude-masterclass.jpg',
    content: `
      ${createContentSection('Introduction', 'Quantitative aptitude and logical reasoning are crucial skills for placement exams and competitive programming. Master mathematical concepts and problem-solving strategies.')}
      
      ${createContentSection('Key Topics Covered', 'Essential aptitude concepts for success:')}
      ${createFeatureList([
        '<strong>Number Systems</strong> - Properties, divisibility, prime numbers',
        '<strong>Algebra & Equations</strong> - Linear, quadratic, inequalities',
        '<strong>Time & Work</strong> - Work rate problems and efficiency',
        '<strong>Profit & Loss</strong> - Business mathematics and percentages',
        '<strong>Logical Reasoning</strong> - Patterns, analogies, series completion'
      ])}
      
      ${createContentSection('Work Rate Problem', 'Classic time and work calculation:')}
      ${createCodeBlock(`// Problem: A completes work in 15 days, B in 10 days
// They work together for 3 days, then B leaves
// How many more days does A need?

function calculateRemainingDays() {
  const aRate = 1/15; // work per day
  const bRate = 1/10;
  const combinedRate = aRate + bRate;
  
  const workDone = combinedRate * 3; // 3 days together
  const remainingWork = 1 - workDone;
  const daysNeeded = remainingWork / aRate;
  
  return daysNeeded;
}

console.log(\`A needs \${calculateRemainingDays()} more days\`);`, 'javascript')}
    `,
    slug: 'quantitative-aptitude',
    week: 1,
    link: 'https://www.youtube.com/watch?v=aptitude-example',
    source: 'YouTube'
  }
];

export const categories = [
  { id: 'all', name: 'All Resources', count: blogPosts.length },
  { id: 'web', name: 'Web Development', count: blogPosts.filter(post => post.category === 'web').length },
  { id: 'dsa', name: 'Data Structures & Algorithms', count: blogPosts.filter(post => post.category === 'dsa').length },
  { id: 'aptitude', name: 'Aptitude & Logical', count: blogPosts.filter(post => post.category === 'aptitude').length }
];

export const weeks = [1, 2, 3, 4, 5, 6, 7];

// React Hook for using blog data
export const useBlogData = () => {
  return {
    posts: blogPosts,
    categories,
    weeks
  };
};

// Utility functions
export const getPostsByCategory = (category: string) => {
  if (category === 'all') return blogPosts;
  return blogPosts.filter(post => post.category === category);
};

export const getPostsByWeek = (week: number) => {
  return blogPosts.filter(post => post.week === week);
};

export const searchPosts = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.description.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};