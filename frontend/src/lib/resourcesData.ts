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
  
  export const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'HTML Forms, HTML5 Semantics, Forms & Flexbox',
      description: 'Learn to build a modern navbar that adapts for both desktop & mobile.Get hands-on with media queries for responsiveness and menu toggling.',
      date: '2025-08-25',
      tags: ['HTML5 tags','flexbox', 'CSS', 'Frontend', 'Web Development'],
      category: 'web',
      level: 'beginner',
      type: 'youtube',
      author: {
        name: 'freeCodeCamp',
        avatar: '/avatars/fcc.jpg'
      },
      readTime: '10 min',
      image: '/blog/react-tutorial.jpg',
      content: 'Full content here...',
      slug: 'complete-react-tutorial',
      week: 1,
      link: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
      source: 'YouTube'
    },
    {
      id: '2',
      title: 'Data Structures & Algorithms Crash Course',
      description: 'Essential DSA concepts every developer should know with implementations in multiple languages and interview preparation tips.',
      date: '2024-01-12',
      tags: ['Algorithms', 'Data Structures', 'Python', 'Interview'],
      category: 'dsa',
      level: 'intermediate',
      type: 'article',
      author: {
        name: 'GeeksforGeeks',
        avatar: '/avatars/geeksforgeeks.jpg'
      },
      readTime: '15 min',
      image: '/blog/dsa-crash-course.jpg',
      content: 'Full content here...',
      slug: 'dsa-crash-course',
      week: 2,
      link: 'https://www.geeksforgeeks.org/data-structures/',
      source: 'GeeksforGeeks'
    },
    {
      id: '3',
      title: 'Advance CSS, flexbox, grid, responsive design, js basics ',
      description: 'Deep dive into JavaScript array methods with practical examples, performance considerations, and real-world use cases.',
      date: '2025-08-31',
      tags: ['CSS', 'JS Arrays', 'Methods', 'Web Development'],
      category: 'web',
      level: 'intermediate',
      type: 'article',
      author: {
        name: 'MDN Web Docs',
        avatar: '/avatars/mdn.jpg'
      },
      readTime: '12 min',
      image: '/blog/js-arrays.jpg',
      content: 'Full content here...',
      slug: 'javascript-array-methods',
      week: 2,
      link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
      source: 'MDN Web Docs'
    },
    {
      id: '4',
      title: 'Quantitative Aptitude Masterclass for Placements',
      description: 'Complete quantitative aptitude and logical reasoning course with shortcuts, practice problems, and placement exam strategies.',
      date: '2024-01-05',
      tags: ['Quantitative', 'Reasoning', 'Math', 'Placements'],
      category: 'aptitude',
      level: 'beginner',
      type: 'youtube',
      author: {
        name: 'CareerRide',
        avatar: '/avatars/careerride.jpg'
      },
      readTime: '25 min',
      image: '/blog/aptitude-masterclass.jpg',
      content: 'Full content here...',
      slug: 'quantitative-aptitude-masterclass',
      week: 1,
      link: 'https://www.youtube.com/watch?v=aptitude-example',
      source: 'YouTube'
    },
    {
      id: '5',
      title: 'Dynamic Programming Patterns for Coding Interviews',
      description: 'Master dynamic programming with common patterns, optimization techniques, and solutions to frequently asked interview problems.',
      date: '2024-01-03',
      tags: ['Dynamic Programming', 'Algorithms', 'Interview', 'Optimization'],
      category: 'dsa',
      level: 'advanced',
      type: 'article',
      author: {
        name: 'NeetCode',
        avatar: '/avatars/neetcode.jpg'
      },
      readTime: '18 min',
      image: '/blog/dp-patterns.jpg',
      content: 'Full content here...',
      slug: 'dynamic-programming-patterns',
      week: 4,
      link: 'https://neetcode.io/practice',
      source: 'NeetCode'
    },
        {
      id: '6',
      title: 'JavaScript Fundamentals, Objects, Functions, Classes, Inheritance ',
      description: 'Deep dive into JavaScript array methods with practical examples, performance considerations, and real-world use cases.',
      date: '2025-09-07',
      tags: ['Objects', 'JS Arrays', 'Methods', 'Web Development'],
      category: 'web',
      level: 'intermediate',
      type: 'article',
      author: {
        name: 'MDN Web Docs',
        avatar: '/avatars/mdn.jpg'
      },
      readTime: '12 min',
      image: '/blog/js-arrays.jpg',
      content: 'Full content here...',
      slug: 'javascript-array-methods',
      week: 3,
      link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
      source: 'MDN Web Docs'
    },
  ];
  
  export const categories = [
    { id: 'all', name: 'All Resources', count: blogPosts.length },
    { id: 'web', name: 'Web Development', count: blogPosts.filter(post => post.category === 'web').length },
    { id: 'dsa', name: 'Data Structures & Algorithms', count: blogPosts.filter(post => post.category === 'dsa').length },
    { id: 'aptitude', name: 'Aptitude & Logical', count: blogPosts.filter(post => post.category === 'aptitude').length },
  ];
  
  export const weeks = [1, 2, 3, 4];
  