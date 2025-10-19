// lib/resourceData.ts

export interface Resource {
  title: string;
  link: string;
  type: string;
  emoji?: string;
}

export interface ResourceSection {
  title: string;
  description: string;
  resources: Resource[];
  sectionType: 'core-tutorials' | 'video-courses' | 'docs' | 'es6-features' | 'practice' | 'reading';
  icon: string;
}

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
  resourceSections?: ResourceSection[];
}

// Helper function to create consistent content sections with glassmorphism
const createContentSection = (title: string, content: string) => `
  <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg mb-6">
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">${title}</h3>
    <div class="text-gray-700 dark:text-gray-300 leading-relaxed">
      ${content}
    </div>
  </div>
`;

const createCodeBlock = (code: string, language = 'javascript') => `
  <div class="bg-gray-900/90 dark:bg-gray-950/90 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50 dark:border-gray-600/50 shadow-lg mb-6">
    <pre class="text-sm text-gray-100 dark:text-gray-300 overflow-x-auto font-mono"><code class="language-${language}">${code}</code></pre>
  </div>
`;

const createFeatureList = (items: string[]) => `
  <div class="grid gap-3 mb-6">
    ${items.map(item => `
      <div class="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-white/20 dark:border-gray-700/30 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
        <div class="text-gray-700 dark:text-gray-300">${item}</div>
      </div>
    `).join('')}
  </div>
`;

const createResourceList = (resources: Array<{title: string, link: string, type: string, emoji?: string}>) => `
  <div class="grid gap-4 mb-6">
    ${resources.map(resource => `
      <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-5 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] group">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              ${resource.emoji ? `<span class="text-lg">${resource.emoji}</span>` : ''}
              <h4 class="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">${resource.title}</h4>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${resource.type}</p>
          </div>
          <a href="${resource.link}" target="_blank" class="inline-flex items-center px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-sm rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm">
            Visit →
          </a>
        </div>
      </div>
    `).join('')}
  </div>
`;

// ========== RESOURCE SECTIONS ==========

// Week 1 - Programming Fundamentals
export const week1Resources: ResourceSection[] = [
  {
    title: "🧠 Decision Making Statements",
    description: "Learn conditional statements and control flow in different programming languages",
    sectionType: "core-tutorials",
    icon: "🧠",
    resources: [
      {
        title: "C - Decision Making Statements",
        link: "https://www.geeksforgeeks.org/decision-making-c-cpp/",
        type: "Syntax & Examples • C Programming",
        emoji: "🔗"
      },
      {
        title: "C++ - Decision Making Statements",
        link: "https://www.geeksforgeeks.org/cpp-decision-making/",
        type: "Syntax & Examples • C++ Programming",
        emoji: "🔗"
      },
      {
        title: "Java - Decision Making Statements",
        link: "https://www.geeksforgeeks.org/decision-making-javaif-else-switch-break-continue-jump/",
        type: "Syntax & Examples • Java Programming",
        emoji: "🔗"
      },
      {
        title: "Python - Decision Making Statements",
        link: "https://www.w3schools.in/python/decision-making",
        type: "Syntax & Examples • Python Programming",
        emoji: "🔗"
      }
    ]
  },
  {
    title: "🔄 Loops & Iteration",
    description: "Master loop constructs and iteration patterns across programming languages",
    sectionType: "core-tutorials",
    icon: "🔄",
    resources: [
      {
        title: "C - Loops & Iteration",
        link: "https://www.geeksforgeeks.org/c-loops/",
        type: "For, While, Do-while • C Programming",
        emoji: "🔗"
      },
      {
        title: "Java - Loops & Iteration",
        link: "https://www.geeksforgeeks.org/loops-in-java/",
        type: "For, While, Enhanced-for • Java",
        emoji: "🔗"
      },
      {
        title: "C++ - Loops & Iteration",
        link: "https://www.geeksforgeeks.org/cpp-loops/?ref=lbp",
        type: "Loop Constructs • C++ Programming",
        emoji: "🔗"
      },
      {
        title: "Python - Loops & Iteration",
        link: "https://www.geeksforgeeks.org/loops-in-python/",
        type: "For, While Loops • Python Programming",
        emoji: "🔗"
      }
    ]
  },
  {
    title: "💻 Practice Problems",
    description: "Apply your knowledge with these programming challenges and pattern problems",
    sectionType: "practice",
    icon: "💻",
    resources: [
      {
        title: "Star Pattern Printing in C",
        link: "https://www.youtube.com/watch?v=KdM6OrvcjPI",
        type: "Video Tutorial • Pattern Problems",
        emoji: "🎥"
      },
      {
        title: "Palindrome Math Problem in Java",
        link: "https://www.youtube.com/watch?v=kNE3vq1g2e8&list=PLUDwpEzHYYLtgkXK6YaZ4I2XcsjMqIaEa&index=4",
        type: "Video Tutorial • Algorithm Practice",
        emoji: "🎥"
      },
      {
        title: "Fibonacci Problem in C++",
        link: "https://www.youtube.com/watch?v=WeG6W2Qwsno&list=PLA1FTfKBAEX5gcjcrTga2ld_jA-9Ww4s0&index=4",
        type: "Video Tutorial • Sequence Problems",
        emoji: "🎥"
      },
      {
        title: "Star Pattern Printing in Python",
        link: "https://www.youtube.com/watch?v=k8SXsT5TLxQ",
        type: "Video Tutorial • Pattern Problems",
        emoji: "🎥"
      }
    ]
  }
];

// Week 2 - Arrays DSA
export const week2Resources: ResourceSection[] = [
  {
    title: "📚 Arrays in Programming Languages",
    description: "Master array data structures across different programming languages",
    sectionType: "core-tutorials",
    icon: "📚",
    resources: [
      {
        title: "Arrays in C - Complete Guide",
        link: "https://www.youtube.com/watch?v=qKFBtCPwjgI",
        type: "Video Tutorial • C Programming",
        emoji: "🎥"
      },
      {
        title: "Arrays in C++ - Comprehensive Tutorial",
        link: "https://www.youtube.com/watch?v=VwUWMcmvfgM",
        type: "Video Tutorial • C++ Programming",
        emoji: "🎥"
      },
      {
        title: "Arrays in Java - Full Course",
        link: "https://www.youtube.com/watch?v=hAk7abWHi3w",
        type: "Video Tutorial • Java Programming",
        emoji: "🎥"
      },
      {
        title: "Arrays in Python - Complete Guide",
        link: "https://youtu.be/9c9qhIcB3NA?si=WlTE1-xOIdJiTg0S",
        type: "Video Tutorial • Python Programming",
        emoji: "🎥"
      }
    ]
  }
];

// Week 3 - String Manipulation
export const week3Resources: ResourceSection[] = [
  {
    title: "🔤 String Manipulation Techniques",
    description: "Advanced string operations and manipulation patterns",
    sectionType: "core-tutorials",
    icon: "🔤",
    resources: [
      {
        title: "String Permutations - Algorithm Guide",
        link: "https://www.youtube.com/watch?v=mEBEw_xScsE",
        type: "Video Tutorial • Algorithm Patterns",
        emoji: "🎥"
      },
      {
        title: "Remove Punctuations from Strings",
        link: "https://www.youtube.com/watch?v=PSCla4rZkjE",
        type: "Video Tutorial • String Cleaning",
        emoji: "🎥"
      },
      {
        title: "Replace Substring Occurrences",
        link: "https://www.youtube.com/watch?v=tGgl6EMZxLU",
        type: "Video Tutorial • String Operations",
        emoji: "🎥"
      }
    ]
  }
];

// Week 4 - Pointers & Two Pointers
export const week4Resources: ResourceSection[] = [
  {
    title: "📍 Pointers & Two Pointers Technique",
    description: "Master pointer concepts and efficient two-pointer algorithms",
    sectionType: "core-tutorials",
    icon: "📍",
    resources: [
      {
        title: "Two Pointers Technique - Complete Guide",
        link: "https://youtu.be/YHwEIfrXZgE?si=uEuacAPG2U4hwuE-",
        type: "Video Tutorial • Algorithm Patterns",
        emoji: "🎥"
      },
      {
        title: "Pointers Mastery Playlist",
        link: "https://m.youtube.com/playlist?list=PLWWrRPCVP0lk9xGR02iXIt2uF7h1M9zrm",
        type: "Video Series • Comprehensive",
        emoji: "🎥"
      }
    ]
  }
];

// Week 1 - HTML & CSS Resources
export const htmlCssResources: ResourceSection[] = [
  {
    title: "🎥 Video Tutorials",
    description: "Learn HTML5 semantics and Flexbox through comprehensive video guides",
    sectionType: "video-courses",
    icon: "🎥",
    resources: [
      {
        title: "HTML Full Course - Build a Website Tutorial",
        link: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
        type: "Comprehensive Tutorial • 4 hours",
        emoji: "🎥"
      },
      {
        title: "HTML5 Semantics & Forms Crash Course",
        link: "https://www.youtube.com/watch?v=ZThq93gZP1M",
        type: "Quick Guide • 30 minutes",
        emoji: "🎥"
      },
      {
        title: "CSS Flexbox Complete Guide",
        link: "https://www.youtube.com/watch?v=fYq5PXgSsbE",
        type: "Layout Mastery • 1 hour",
        emoji: "🎥"
      }
    ]
  },
  {
    title: "📖 Documentation",
    description: "Official documentation and detailed guides",
    sectionType: "docs",
    icon: "📖",
    resources: [
      {
        title: "MDN HTML5 Semantic Elements",
        link: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element#content_sectioning",
        type: "Official Docs • Reference",
        emoji: "📖"
      },
      {
        title: "W3Schools HTML Forms",
        link: "https://www.w3schools.com/html/html_forms.asp",
        type: "Interactive Guide • Examples",
        emoji: "📖"
      },
      {
        title: "CSS-Tricks Flexbox Guide",
        link: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
        type: "Visual Guide • Complete",
        emoji: "📖"
      }
    ]
  }
];

// Week 2 - Advanced CSS Resources
export const advancedCssResources: ResourceSection[] = [
  {
    title: "🎥 Video Courses",
    description: "Master advanced CSS techniques with video tutorials",
    sectionType: "video-courses",
    icon: "🎥",
    resources: [
      {
        title: "CSS Grid vs Flexbox - When to Use What",
        link: "https://www.youtube.com/watch?v=RSIclWvNTdQ",
        type: "Comparison Guide • Practical",
        emoji: "🎥"
      },
      {
        title: "Advanced CSS Layouts Masterclass",
        link: "https://www.youtube.com/watch?v=qx1H38X0wq8",
        type: "Deep Dive • 2 hours",
        emoji: "🎥"
      }
    ]
  },
  {
    title: "📖 Reading Materials",
    description: "Detailed articles and documentation",
    sectionType: "docs",
    icon: "📖",
    resources: [
      {
        title: "MDN CSS Grid Guide",
        link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout",
        type: "Official Docs • Comprehensive",
        emoji: "📖"
      },
      {
        title: "Responsive Design Patterns",
        link: "https://web.dev/patterns/layout/",
        type: "Modern Patterns • Examples",
        emoji: "📖"
      }
    ]
  }
];

// Week 3 - JavaScript Fundamentals Resources
export const jsFundamentalsResources: ResourceSection[] = [
  {
    title: "🎥 Video Courses",
    description: "Start with these comprehensive video tutorials",
    sectionType: "video-courses",
    icon: "🎥",
    resources: [
      {
        title: "freeCodeCamp - 7hr Full JavaScript Course",
        link: "https://www.youtube.com/watch?v=jS4aFq5-91M",
        type: "Video Course • 7 hours",
        emoji: "🎥"
      },
      {
        title: "Programming with Mosh - Complete JavaScript Playlist",
        link: "https://www.youtube.com/playlist?list=PLTjRvDozrdlxEIuOBZkMAK5uiqp8rHUax",
        type: "Video Playlist • Multiple videos",
        emoji: "🎥"
      },
      {
        title: "The Net Ninja - JavaScript for Beginners",
        link: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9i9Ae2D9Ee1RvylH38dKuET",
        type: "Video Series • Beginner focused",
        emoji: "🎥"
      }
    ]
  },
  {
    title: "📖 Reading & Documentation",
    description: "Deepen your understanding with comprehensive reading materials",
    sectionType: "docs",
    icon: "📖",
    resources: [
      {
        title: "The Modern JavaScript Tutorial",
        link: "https://javascript.info",
        type: "Comprehensive Tutorial • All levels",
        emoji: "📖"
      },
      {
        title: "MDN JavaScript Guide",
        link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        type: "Official Documentation • Reference",
        emoji: "📖"
      }
    ]
  },
  {
    title: "💻 Practice Platforms",
    description: "Apply your knowledge with interactive exercises",
    sectionType: "practice",
    icon: "💻",
    resources: [
      {
        title: "W3Schools JavaScript Exercises",
        link: "https://www.w3schools.com/js/js_exercises.asp",
        type: "Interactive Exercises • Beginner",
        emoji: "💻"
      },
      {
        title: "JS Hero - 100 JavaScript Functions",
        link: "https://www.jshero.net/",
        type: "Function Practice • Step-by-step",
        emoji: "💻"
      },
      {
        title: "JSChallenger - Interactive Challenges",
        link: "https://www.jschallenger.com/",
        type: "Coding Challenges • All levels",
        emoji: "💻"
      }
    ]
  }
];

// Week 4 - DOM Manipulation Resources
export const domResources: ResourceSection[] = [
  {
    title: "🎥 Video Tutorials",
    description: "Learn DOM manipulation through comprehensive video guides",
    sectionType: "video-courses",
    icon: "🎥",
    resources: [
      {
        title: "How to Use the DOM in JavaScript | Beginner's Guide",
        link: "https://youtube.com/watch?v=Wy1ODjtQ1G0",
        type: "Beginner Tutorial • Step-by-step",
        emoji: "🎥"
      },
      {
        title: "JavaScript DOM Manipulation – Full Course | freeCodeCamp",
        link: "https://youtube.com/watch?v=5fb2aPlgoys",
        type: "Full Course • Comprehensive",
        emoji: "🎥"
      },
      {
        title: "The BEST Way to Master JavaScript DOM in 2025",
        link: "https://youtube.com/watch?v=bI-yNnJDNcs",
        type: "Modern Approach • Best Practices",
        emoji: "🎥"
      }
    ]
  },
  {
    title: "📖 Essential Readings",
    description: "Deep dive into DOM concepts with detailed documentation",
    sectionType: "docs",
    icon: "📖",
    resources: [
      {
        title: "JavaScript DOM Tutorial - JavaScript Tutorial",
        link: "https://javascripttutorial.net/javascript-dom/",
        type: "Comprehensive Guide • Detailed",
        emoji: "📖"
      },
      {
        title: "DOM Manipulation Guide - GeeksforGeeks",
        link: "https://www.geeksforgeeks.org/javascript/how-to-manipulate-dom-elements-in-javascript/",
        type: "Technical Reference • Examples",
        emoji: "📖"
      }
    ]
  }
];

// Week 5 - Advanced JavaScript Resources
export const advancedJsResources: ResourceSection[] = [
  {
    title: "🎥 Video Tutorials",
    description: "Visual explanations of advanced JavaScript concepts",
    sectionType: "video-courses",
    icon: "🎥",
    resources: [
      {
        title: "Closures in JavaScript - Visual Explanation",
        link: "https://www.youtube.com/watch?v=82JI-QzgiGg",
        type: "Concept Visualization • 10 min",
        emoji: "🎥"
      },
      {
        title: "JavaScript ES6 Arrow Functions Tutorial",
        link: "https://www.youtube.com/watch?v=h33Srr5J9nY",
        type: "Syntax Guide • Practical",
        emoji: "🎥"
      },
      {
        title: "Async JS Crash Course – Callbacks, Promises, Async/Await",
        link: "https://www.youtube.com/watch?v=PoRJizFvM7s",
        type: "Async Mastery • Comprehensive",
        emoji: "🎥"
      }
    ]
  },
  {
    title: "📖 Essential Readings",
    description: "Detailed documentation and guides",
    sectionType: "docs",
    icon: "📖",
    resources: [
      {
        title: "JavaScript Closures - W3Schools",
        link: "https://www.w3schools.com/js/js_function_closures.asp",
        type: "Beginner Guide • Examples",
        emoji: "📖"
      },
      {
        title: "ES6 Arrow Functions - GeeksforGeeks",
        link: "https://www.geeksforgeeks.org/javascript/es6-arrow-function/",
        type: "Technical Reference • Deep Dive",
        emoji: "📖"
      }
    ]
  }
];

// Week 6 - Arrays & ES6 Resources
export const arraysEs6Resources: ResourceSection[] = [
  {
    title: "📚 Learn the Basics",
    description: "Comprehensive array method guides",
    sectionType: "core-tutorials",
    icon: "📚",
    resources: [
      {
        title: "W3Schools – Array Methods",
        link: "https://www.w3schools.com/js/js_array_methods.asp",
        type: "Beginner Guide • map, filter, reduce",
        emoji: "📚"
      },
      {
        title: "JavaScript.info – Array Methods",
        link: "https://javascript.info/array-methods",
        type: "Detailed Tutorial • Comprehensive",
        emoji: "📚"
      }
    ]
  },
  {
    title: "🎥 Watch & Learn",
    description: "Visual learning through video tutorials",
    sectionType: "video-courses",
    icon: "🎥",
    resources: [
      {
        title: "JS Arrays Explained - Bro Code",
        link: "https://www.youtube.com/watch?v=oigfaZ5ApsM",
        type: "Visual Guide • Comprehensive",
        emoji: "🎥"
      },
      {
        title: "ES6 Destructuring, Spread & Rest - Mosh",
        link: "https://www.youtube.com/watch?v=NIq3qLaHCIs",
        type: "Modern Syntax • Best Practices",
        emoji: "🎥"
      }
    ]
  },
  {
    title: "✨ ES6 Essentials",
    description: "Modern JavaScript features",
    sectionType: "es6-features",
    icon: "✨",
    resources: [
      {
        title: "W3Schools – Spread & Rest",
        link: "https://www.w3schools.com/react/react_es6_spread.asp",
        type: "Syntax Guide • Examples",
        emoji: "✨"
      },
      {
        title: "FreeCodeCamp – Destructuring & Spread",
        link: "https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/",
        type: "In-depth Tutorial • Practical",
        emoji: "✨"
      }
    ]
  }
];

// Week 7 - JavaScript Objects Resources
export const jsObjectsResources: ResourceSection[] = [
  {
    title: "🧩 Core Tutorials",
    description: "Learn object fundamentals",
    sectionType: "core-tutorials",
    icon: "🧩",
    resources: [
      {
        title: "W3Schools - Object Syntax & Property Access",
        link: "https://www.w3schools.com/js/js_objects.asp",
        type: "Beginner Guide • Syntax Basics",
        emoji: "🧩"
      },
      {
        title: "JavaScript.info - Object Creation & Manipulation",
        link: "https://javascript.info/object",
        type: "Comprehensive Tutorial • Detailed",
        emoji: "🧩"
      },
      {
        title: "Programiz - Beginner-friendly with Live Examples",
        link: "https://www.programiz.com/javascript/object",
        type: "Interactive Learning • Examples",
        emoji: "🧩"
      }
    ]
  },
  {
    title: "⚙ ES6+ Modern Features",
    description: "Advanced object syntax and patterns",
    sectionType: "es6-features",
    icon: "⚙",
    resources: [
      {
        title: "TutorialsPoint - Modern Syntax & Destructuring",
        link: "https://www.tutorialspoint.com/es6/es6_objects.htm",
        type: "ES6 Features • Modern Patterns",
        emoji: "⚙"
      },
      {
        title: "GUVI - Methods, This Keyword & Classes",
        link: "https://www.guvi.in/",
        type: "Advanced Concepts • Practical",
        emoji: "⚙"
      }
    ]
  }
];

// DSA Resources
export const dsaResources: ResourceSection[] = [
  {
    title: "📚 Core Concepts",
    description: "Fundamental data structures and algorithms",
    sectionType: "core-tutorials",
    icon: "📚",
    resources: [
      {
        title: "GeeksforGeeks - Data Structures",
        link: "https://www.geeksforgeeks.org/data-structures/",
        type: "Comprehensive Guide • All Topics",
        emoji: "📚"
      },
      {
        title: "freeCodeCamp - Algorithms and Data Structures",
        link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
        type: "Interactive Course • Projects",
        emoji: "📚"
      }
    ]
  }
];

// Aptitude Resources
export const aptitudeResources: ResourceSection[] = [
  {
    title: "🧠 Quantitative Aptitude",
    description: "Mathematical concepts and problem-solving",
    sectionType: "core-tutorials",
    icon: "🧠",
    resources: [
      {
        title: "CareerRide - Aptitude Masterclass",
        link: "https://www.youtube.com/watch?v=aptitude-example",
        type: "Video Course • Complete",
        emoji: "🧠"
      },
      {
        title: "Indiabix - Practice Questions",
        link: "https://www.indiabix.com/",
        type: "Practice Platform • Extensive",
        emoji: "🧠"
      }
    ]
  }
];

// ========== BLOG POSTS ==========

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
    `,
    slug: 'html5-semantics-flexbox',
    week: 1,
    link: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
    source: 'YouTube',
    resourceSections: htmlCssResources
  },
  {
    id: '2',
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
    `,
    slug: 'advanced-css-layouts',
    week: 2,
    link: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    source: 'MDN Web Docs',
    resourceSections: advancedCssResources
  },
  {
    id: '3',
    title: 'JavaScript Fundamentals - Complete Learning Path',
    description: 'Master JavaScript from basics to advanced concepts with curated video courses, tutorials, and practice exercises.',
    date: '2025-09-14',
    tags: ['JavaScript', 'ES6+', 'DOM', 'Async Programming', 'Web Development'],
    category: 'web',
    level: 'beginner',
    type: 'article',
    author: {
      name: 'Multiple Sources',
      avatar: '/avatars/js-learning.jpg'
    },
    readTime: '20 min',
    image: '/blog/javascript-fundamentals.jpg',
    content: `
      ${createContentSection('Introduction', 'JavaScript is the backbone of modern web development. This comprehensive learning path covers everything from basic syntax to advanced concepts, with curated resources from top educational platforms.')}
    `,
    slug: 'javascript-fundamentals-learning-path',
    week: 3,
    link: 'https://javascript.info',
    source: 'Multiple Sources',
    resourceSections: jsFundamentalsResources
  },
  {
    id: '4',
    title: 'JavaScript DOM Manipulation & Events - Complete Guide',
    description: 'Master DOM manipulation, event handling, and dynamic content creation with comprehensive tutorials and practical examples.',
    date: '2025-09-21',
    tags: ['JavaScript', 'DOM', 'Events', 'Web Development'],
    category: 'web',
    level: 'intermediate',
    type: 'article',
    author: {
      name: 'Multiple Sources',
      avatar: '/avatars/dom-events.jpg'
    },
    readTime: '15 min',
    image: '/blog/js-dom.jpg',
    content: `
      ${createContentSection('Introduction', 'The Document Object Model (DOM) is a programming interface for web documents. JavaScript DOM manipulation allows dynamic changes to content, structure, and styling, making web pages interactive and responsive.')}
    `,
    slug: 'javascript-dom-manipulation',
    week: 4,
    link: 'https://javascripttutorial.net/javascript-dom/',
    source: 'Multiple Sources',
    resourceSections: domResources
  },
  {
    id: '5',
    title: 'Advanced JavaScript Functions & Async Programming',
    description: 'Master closures, arrow functions, and asynchronous programming with callbacks, promises, and async/await patterns.',
    date: '2025-09-28',
    tags: ['JavaScript', 'Closures', 'Async', 'ES6', 'Functions'],
    category: 'web',
    level: 'intermediate',
    type: 'article',
    author: {
      name: 'Multiple Sources',
      avatar: '/avatars/async-js.jpg'
    },
    readTime: '12 min',
    image: '/blog/async-js.jpg',
    content: `
      ${createContentSection('Introduction', 'This week we move beyond basics into advanced JavaScript concepts: closures, modern function syntax, and asynchronous programming patterns that power modern web applications.')}
    `,
    slug: 'advanced-javascript-functions',
    week: 5,
    link: 'https://www.w3schools.com/js/js_function_closures.asp',
    source: 'Multiple Sources',
    resourceSections: advancedJsResources
  },
  {
    id: '6',
    title: 'JavaScript Arrays & ES6 Modern Features',
    description: 'Master array methods, destructuring, spread/rest operators, and other essential ES6+ features for modern JavaScript development.',
    date: '2025-10-05',
    tags: ['JavaScript', 'Arrays', 'ES6', 'Destructuring', 'Spread'],
    category: 'web',
    level: 'intermediate',
    type: 'article',
    author: {
      name: 'Multiple Sources',
      avatar: '/avatars/es6-features.jpg'
    },
    readTime: '14 min',
    image: '/blog/es6-arrays.jpg',
    content: `
      ${createContentSection('Introduction', 'This week focuses on JavaScript Arrays and ES6 features that make code more readable and maintainable. Master array methods and modern syntax for efficient development.')}
    `,
    slug: 'javascript-arrays-es6',
    week: 6,
    link: 'https://javascript.info/array-methods',
    source: 'Multiple Sources',
    resourceSections: arraysEs6Resources
  },
  {
    id: '7',
    title: 'JavaScript Objects - Core Concepts & Modern Syntax',
    description: 'Master JavaScript objects from basic syntax to advanced ES6+ features including methods, destructuring, and modern object patterns.',
    date: '2025-10-12',
    tags: ['JavaScript', 'Objects', 'ES6', 'Methods', 'Destructuring'],
    category: 'web',
    level: 'intermediate',
    type: 'article',
    author: {
      name: 'Multiple Sources',
      avatar: '/avatars/js-objects.jpg'
    },
    readTime: '16 min',
    image: '/blog/js-objects.jpg',
    content: `
      ${createContentSection('Introduction', 'JavaScript Objects are fundamental to mastering JS logic and real-world coding. This week covers both basics and modern ES6+ object features for professional development.')}
    `,
    slug: 'javascript-objects',
    week: 7,
    link: 'https://javascript.info/object',
    source: 'Multiple Sources',
    resourceSections: jsObjectsResources
  },
  {
    id: '8',
    title: 'Data Structures & Algorithms Crash Course',
    description: 'Essential DSA concepts every developer should know with implementations and interview preparation tips.',
    date: '2024-08-11',
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
    `,
    slug: 'dsa-crash-course',
    week: 1,
    link: 'https://www.geeksforgeeks.org/data-structures/',
    source: 'GeeksforGeeks',
    resourceSections: dsaResources
  },
  // ========== NEW DSA RESOURCES FOR WEEK 2 ==========
  {
    id: '10',
    title: 'Arrays in Programming Languages - Complete Guide',
    description: 'Master array data structures across C, C++, Java, and Python with comprehensive video tutorials and practical examples.',
    date: '2025-08-21',
    tags: ['Arrays', 'C', 'C++', 'Java', 'Python', 'DSA'],
    category: 'dsa',
    level: 'beginner',
    type: 'youtube',
    author: {
      name: 'Multiple Instructors',
      avatar: '/avatars/array-tutorials.jpg'
    },
    readTime: '25 min',
    image: '/blog/arrays-programming.jpg',
    content: `
      ${createContentSection('Introduction', 'Arrays are fundamental data structures that store collections of elements. This comprehensive guide covers array implementation and usage across multiple programming languages.')}

      ${createContentSection('Programming Language Coverage', 'Master arrays in your preferred programming language:')}
      ${createFeatureList([
        '<strong>C Programming</strong> - Static arrays, memory allocation, and pointer arithmetic',
        '<strong>C++ Programming</strong> - STL vectors, dynamic arrays, and modern C++ features',
        '<strong>Java Programming</strong> - Fixed-size arrays, ArrayList, and Java Collections',
        '<strong>Python Programming</strong> - Lists, tuples, and built-in array operations'
      ])}

      ${createContentSection('Key Array Operations', 'Essential operations across all languages:')}
      ${createCodeBlock(`// Common Array Operations (JavaScript example)
const numbers = [1, 3, 5, 7, 9];

// Access elements
console.log(numbers[0]); // 1

// Add elements
numbers.push(11);

// Remove elements
numbers.pop();

// Iterate through array
numbers.forEach(num => console.log(num));

// Find element
const found = numbers.find(num => num > 5);
console.log(found);`, 'javascript')}
    `,
    slug: 'arrays-programming-languages',
    week: 2,
    link: 'https://www.youtube.com/watch?v=qKFBtCPwjgI',
    source: 'YouTube',
    resourceSections: [
      {
        title: '🎥 Video Tutorials',
        description: 'Comprehensive array tutorials for each programming language',
        sectionType: 'video-courses',
        icon: '🎥',
        resources: [
          {
            title: 'Arrays in C - Complete Guide',
            link: 'https://www.youtube.com/watch?v=qKFBtCPwjgI',
            type: 'Video Tutorial • C Programming',
            emoji: '🎥'
          },
          {
            title: 'Arrays in C++ - Comprehensive Tutorial',
            link: 'https://www.youtube.com/watch?v=VwUWMcmvfgM',
            type: 'Video Tutorial • C++ Programming',
            emoji: '🎥'
          },
          {
            title: 'Arrays in Java - Full Course',
            link: 'https://www.youtube.com/watch?v=hAk7abWHi3w',
            type: 'Video Tutorial • Java Programming',
            emoji: '🎥'
          },
          {
            title: 'Arrays in Python - Complete Guide',
            link: 'https://youtu.be/9c9qhIcB3NA?si=WlTE1-xOIdJiTg0S',
            type: 'Video Tutorial • Python Programming',
            emoji: '🎥'
          }
        ]
      }
    ]
  },
  {
    id: '11',
    title: 'Decision Making & Control Flow in Programming',
    description: 'Master conditional statements and control flow across C, C++, Java, and Python with syntax examples and practical applications.',
    date: '2025-08-21',
    tags: ['Decision Making', 'Control Flow', 'C', 'C++', 'Java', 'Python', 'DSA'],
    category: 'dsa',
    level: 'beginner',
    type: 'documentation',
    author: {
      name: 'GeeksforGeeks',
      avatar: '/avatars/geeksforgeeks.jpg'
    },
    readTime: '18 min',
    image: '/blog/decision-making.jpg',
    content: `
      ${createContentSection('Introduction', 'Decision making statements and control flow are fundamental programming concepts that allow your code to make choices and execute different paths based on conditions.')}

      ${createContentSection('Programming Language Syntax', 'Learn conditional statements across multiple languages:')}
      ${createFeatureList([
        '<strong>C Programming</strong> - if, if-else, switch statements with syntax examples',
        '<strong>C++ Programming</strong> - Enhanced control flow with modern C++ features',
        '<strong>Java Programming</strong> - Object-oriented conditional logic and switch expressions',
        '<strong>Python Programming</strong> - Clean, readable conditional statements'
      ])}

      ${createContentSection('Practical Examples', 'Real-world applications of decision making:')}
      ${createCodeBlock(`// Decision Making Example (JavaScript)
function checkEligibility(age, hasLicense) {
  if (age >= 18) {
    if (hasLicense) {
      return "You can drive!";
    } else {
      return "You need a license to drive.";
    }
  } else {
    return "You are too young to drive.";
  }
}

console.log(checkEligibility(20, true));  // "You can drive!"
console.log(checkEligibility(16, false)); // "You are too young to drive."`, 'javascript')}
    `,
    slug: 'decision-making-control-flow',
    week: 2,
    link: 'https://www.geeksforgeeks.org/decision-making-c-cpp/',
    source: 'GeeksforGeeks',
    resourceSections: [
      {
        title: '📚 Documentation & Tutorials',
        description: 'Comprehensive guides for decision making across programming languages',
        sectionType: 'docs',
        icon: '📚',
        resources: [
          {
            title: 'C - Decision Making Statements',
            link: 'https://www.geeksforgeeks.org/decision-making-c-cpp/',
            type: 'Documentation • C Programming',
            emoji: '📖'
          },
          {
            title: 'C++ - Decision Making Statements',
            link: 'https://www.geeksforgeeks.org/cpp-decision-making/',
            type: 'Documentation • C++ Programming',
            emoji: '📖'
          },
          {
            title: 'Java - Decision Making Statements',
            link: 'https://www.geeksforgeeks.org/decision-making-javaif-else-switch-break-continue-jump/',
            type: 'Documentation • Java Programming',
            emoji: '📖'
          },
          {
            title: 'Python - Decision Making Statements',
            link: 'https://www.w3schools.in/python/decision-making',
            type: 'Documentation • Python Programming',
            emoji: '📖'
          }
        ]
      }
    ]
  },
  {
    id: '12',
    title: 'Loops & Iteration in Programming Languages',
    description: 'Master loop constructs and iteration patterns across C, C++, Java, and Python with syntax examples and practical applications.',
    date: '2025-08-28',
    tags: ['Loops', 'Iteration', 'C', 'C++', 'Java', 'Python', 'DSA'],
    category: 'dsa',
    level: 'beginner',
    type: 'documentation',
    author: {
      name: 'GeeksforGeeks',
      avatar: '/avatars/geeksforgeeks.jpg'
    },
    readTime: '20 min',
    image: '/blog/loops-iteration.jpg',
    content: `
      ${createContentSection('Introduction', 'Loops are essential programming constructs that allow you to execute a block of code repeatedly. Understanding different loop types and their applications is crucial for efficient programming.')}

      ${createContentSection('Loop Types Across Languages', 'Master different iteration patterns in multiple programming languages:')}
      ${createFeatureList([
        '<strong>For Loops</strong> - Definite iteration with counter control',
        '<strong>While Loops</strong> - Indefinite iteration based on conditions',
        '<strong>Do-While Loops</strong> - Execute at least once, then check condition',
        '<strong>Enhanced For Loops</strong> - Modern iteration over collections'
      ])}

      ${createContentSection('Practical Loop Examples', 'Real-world applications of loops:')}
      ${createCodeBlock(`// Loop Examples (JavaScript)
const numbers = [1, 2, 3, 4, 5];

// For loop
for (let i = 0; i < numbers.length; i++) {
  console.log(\`Number: \${numbers[i]}\`);
}

// While loop
let count = 0;
while (count < 5) {
  console.log(\`Count: \${count}\`);
  count++;
}

// For...of loop (ES6+)
for (const number of numbers) {
  console.log(\`Modern loop: \${number}\`);
}`, 'javascript')}
    `,
    slug: 'loops-iteration-programming',
    week: 2,
    link: 'https://www.geeksforgeeks.org/c-loops/',
    source: 'GeeksforGeeks',
    resourceSections: [
      {
        title: '📚 Documentation & Tutorials',
        description: 'Comprehensive loop guides for each programming language',
        sectionType: 'docs',
        icon: '📚',
        resources: [
          {
            title: 'C - Loops & Iteration',
            link: 'https://www.geeksforgeeks.org/c-loops/',
            type: 'Documentation • C Programming',
            emoji: '📖'
          },
          {
            title: 'Java - Loops & Iteration',
            link: 'https://www.geeksforgeeks.org/loops-in-java/',
            type: 'Documentation • Java Programming',
            emoji: '📖'
          },
          {
            title: 'C++ - Loops & Iteration',
            link: 'https://www.geeksforgeeks.org/cpp-loops/?ref=lbp',
            type: 'Documentation • C++ Programming',
            emoji: '📖'
          },
          {
            title: 'Python - Loops & Iteration',
            link: 'https://www.geeksforgeeks.org/loops-in-python/',
            type: 'Documentation • Python Programming',
            emoji: '📖'
          }
        ]
      }
    ]
  },
  {
    id: '13',
    title: 'Programming Pattern Problems & Practice',
    description: 'Apply your programming fundamentals with pattern printing problems and algorithmic challenges across multiple languages.',
    date: '2025-09-7',
    tags: ['Pattern Problems', 'Programming Practice', 'C', 'C++', 'Java', 'Python', 'DSA'],
    category: 'dsa',
    level: 'beginner',
    type: 'youtube',
    author: {
      name: 'Multiple Instructors',
      avatar: '/avatars/pattern-problems.jpg'
    },
    readTime: '22 min',
    image: '/blog/pattern-problems.jpg',
    content: `
      ${createContentSection('Introduction', 'Pattern problems help reinforce programming fundamentals like loops, conditionals, and algorithmic thinking. These problems are excellent for building problem-solving skills and understanding code structure.')}

      ${createContentSection('Problem Categories', 'Different types of pattern problems to practice:')}
      ${createFeatureList([
        '<strong>Star Patterns</strong> - Basic geometric patterns using nested loops',
        '<strong>Number Patterns</strong> - Mathematical sequences and numerical displays',
        '<strong>String Patterns</strong> - Text-based pattern generation',
        '<strong>Algorithmic Problems</strong> - Fibonacci, palindrome, and logic problems'
      ])}

      ${createContentSection('Pattern Problem Example', 'Star pattern implementation across languages:')}
      ${createCodeBlock(`// Star Pattern Example (JavaScript)
function printStarPattern(rows) {
  for (let i = 1; i <= rows; i++) {
    let pattern = '';
    for (let j = 1; j <= i; j++) {
      pattern += '* ';
    }
    console.log(pattern);
  }
}

// Usage
printStarPattern(5);
/*
*
* *
* * *
* * * *
* * * * *
*/`, 'javascript')}
    `,
    slug: 'programming-pattern-problems',
    week: 2,
    link: 'https://www.youtube.com/watch?v=KdM6OrvcjPI',
    source: 'YouTube',
    resourceSections: [
      {
        title: '🎥 Video Tutorials',
        description: 'Step-by-step pattern problem solutions',
        sectionType: 'video-courses',
        icon: '🎥',
        resources: [
          {
            title: 'Star Pattern Printing in C',
            link: 'https://www.youtube.com/watch?v=KdM6OrvcjPI',
            type: 'Video Tutorial • Pattern Problems',
            emoji: '🎥'
          },
          {
            title: 'Palindrome Math Problem in Java',
            link: 'https://www.youtube.com/watch?v=kNE3vq1g2e8',
            type: 'Video Tutorial • Algorithm Practice',
            emoji: '🎥'
          },
          {
            title: 'Fibonacci Problem in C++',
            link: 'https://www.youtube.com/watch?v=WeG6W2Qwsno',
            type: 'Video Tutorial • Sequence Problems',
            emoji: '🎥'
          },
          {
            title: 'Star Pattern Printing in Python',
            link: 'https://www.youtube.com/watch?v=k8SXsT5TLxQ',
            type: 'Video Tutorial • Pattern Problems',
            emoji: '🎥'
          }
        ]
      }
    ]
  },
  // ========== NEW DSA RESOURCES FOR WEEK 3 ==========
  {
    id: '14',
    title: 'String Manipulation Techniques - Advanced Guide',
    description: 'Master advanced string manipulation techniques including permutations, punctuation removal, and substring replacement across programming languages.',
    date: '2025-09-14',
    tags: ['String Manipulation', 'Permutations', 'Algorithms', 'DSA'],
    category: 'dsa',
    level: 'intermediate',
    type: 'youtube',
    author: {
      name: 'Multiple Instructors',
      avatar: '/avatars/string-manipulation.jpg'
    },
    readTime: '28 min',
    image: '/blog/string-manipulation.jpg',
    content: `
      ${createContentSection('Introduction', 'String manipulation is a crucial skill in programming that involves modifying, analyzing, and processing text data. These techniques are essential for data cleaning, text processing, and algorithmic problem-solving.')}

      ${createContentSection('Advanced String Techniques', 'Master these essential string manipulation methods:')}
      ${createFeatureList([
        '<strong>String Permutations</strong> - Generate all possible arrangements of characters',
        '<strong>Punctuation Removal</strong> - Clean text by removing special characters',
        '<strong>Substring Replacement</strong> - Replace specific text patterns efficiently',
        '<strong>String Searching</strong> - Find patterns and substrings within larger text'
      ])}

      ${createContentSection('String Permutation Example', 'Generate all permutations of a string:')}
      ${createCodeBlock(`// String Permutation Algorithm (JavaScript)
function generatePermutations(str) {
  const results = [];

  function permute(arr, start) {
    if (start === arr.length - 1) {
      results.push([...arr].join(''));
      return;
    }

    for (let i = start; i < arr.length; i++) {
      // Swap elements
      [arr[start], arr[i]] = [arr[i], arr[start]];

      // Recurse
      permute(arr, start + 1);

      // Backtrack
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  }

  permute([...str]);
  return results;
}

// Usage
console.log(generatePermutations('abc'));
/* Output: ['abc', 'acb', 'bac', 'bca', 'cab', 'cba'] */`, 'javascript')}
    `,
    slug: 'string-manipulation-techniques',
    week: 3,
    link: 'https://www.youtube.com/watch?v=mEBEw_xScsE',
    source: 'YouTube',
    resourceSections: [
      {
        title: '🎥 Video Tutorials',
        description: 'Advanced string manipulation technique tutorials',
        sectionType: 'video-courses',
        icon: '🎥',
        resources: [
          {
            title: 'String Permutations - Algorithm Guide',
            link: 'https://www.youtube.com/watch?v=mEBEw_xScsE',
            type: 'Video Tutorial • Algorithm Patterns',
            emoji: '🎥'
          },
          {
            title: 'Remove Punctuations from Strings',
            link: 'https://www.youtube.com/watch?v=PSCla4rZkjE',
            type: 'Video Tutorial • String Cleaning',
            emoji: '🎥'
          },
          {
            title: 'Replace Substring Occurrences',
            link: 'https://www.youtube.com/watch?v=tGgl6EMZxLU',
            type: 'Video Tutorial • String Operations',
            emoji: '🎥'
          }
        ]
      }
    ] // ========== NEW DSA RESOURCES FOR WEEK 4 ==========
  },
  {
    id: '15',
    title: 'Pointers & Two Pointers Technique - Complete Guide',
    description: 'Master pointer concepts and the efficient two-pointer algorithm technique for solving array and string problems.',
    date: '2025-09-21',
    tags: ['Pointers', 'Two Pointers', 'Algorithms', 'DSA'],
    category: 'dsa',
    level: 'intermediate',
    type: 'youtube',
    author: {
      name: 'Multiple Instructors',
      avatar: '/avatars/pointers-technique.jpg'
    },
    readTime: '24 min',
    image: '/blog/pointers-two-pointers.jpg',
    content: `
      ${createContentSection('Introduction', 'Pointers are powerful programming constructs that store memory addresses, while the two-pointer technique is an efficient algorithm pattern for solving problems involving arrays and strings.')}

      ${createContentSection('Core Concepts', 'Essential pointer and two-pointer concepts:')}
      ${createFeatureList([
        '<strong>Pointer Fundamentals</strong> - Memory addresses, dereferencing, and pointer arithmetic',
        '<strong>Two Pointer Technique</strong> - Fast and slow pointers for optimal solutions',
        '<strong>Array Problems</strong> - Finding pairs, removing duplicates, and searching',
        '<strong>String Problems</strong> - Palindrome checking and pattern matching'
      ])}

      ${createContentSection('Two Pointers Example', 'Finding pairs that sum to a target value:')}
      ${createCodeBlock(`// Two Pointers - Find pairs that sum to target (JavaScript)
function findPairsWithSum(arr, target) {
  arr.sort((a, b) => a - b);
  let left = 0;
  let right = arr.length - 1;
  const pairs = [];

  while (left < right) {
    const sum = arr[left] + arr[right];

    if (sum === target) {
      pairs.push([arr[left], arr[right]]);
      left++;
      right--;
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }

  return pairs;
}

// Usage
console.log(findPairsWithSum([1, 2, 3, 4, 5, 6], 7));
/* Output: [[1, 6], [2, 5], [3, 4]] */`, 'javascript')}
    `,
    slug: 'pointers-two-pointers-technique',
    week: 4,
    link: 'https://youtu.be/YHwEIfrXZgE?si=uEuacAPG2U4hwuE-',
    source: 'YouTube',
    resourceSections: [
      {
        title: '🎥 Video Tutorials',
        description: 'Comprehensive video tutorials on pointers and two-pointer techniques',
        sectionType: 'video-courses',
        icon: '🎥',
        resources: [
          {
            title: 'Two Pointers Technique - Complete Guide',
            link: 'https://youtu.be/YHwEIfrXZgE?si=uEuacAPG2U4hwuE-',
            type: 'Video Tutorial • Algorithm Patterns',
            emoji: '🎥'
          },
          {
            title: 'Pointers Mastery Playlist',
            link: 'https://m.youtube.com/playlist?list=PLWWrRPCVP0lk9xGR02iXIt2uF7h1M9zrm',
            type: 'Video Series • Comprehensive',
            emoji: '🎥'
          }
        ]
      }
    ]
  },
  // ========== NEW DSA RESOURCES FOR WEEK 5 ==========
  {
    id: '16',
    title: 'Matrix Operations & Transformations',
    description: 'Master matrix operations including rotation, inversion, 2D to 1D conversion, and symmetry checking with practical algorithms.',
    date: '2025-09-28',
    tags: ['Matrix', '2D Arrays', 'Rotation', 'Inversion', 'DSA'],
    category: 'dsa',
    level: 'intermediate',
    type: 'youtube',
    author: {
      name: 'Multiple Instructors',
      avatar: '/avatars/matrix-operations.jpg'
    },
    readTime: '30 min',
    image: '/blog/matrix-operations.jpg',
    content: `
      ${createContentSection('Introduction', 'Matrix operations are fundamental in computer graphics, image processing, and data analysis. Understanding these transformations is crucial for algorithmic problem-solving.')}

      ${createContentSection('Essential Matrix Operations', 'Key matrix manipulation techniques:')}
      ${createFeatureList([
        '<strong>Matrix Rotation</strong> - 90, 180, 270 degree rotations',
        '<strong>Matrix Inversion</strong> - Mathematical matrix inverse operations',
        '<strong>2D to 1D Conversion</strong> - Flattening matrix data structures',
        '<strong>Symmetry Checking</strong> - Identifying symmetric matrix patterns'
      ])}

      ${createContentSection('Matrix Rotation Example', '90-degree clockwise rotation algorithm:')}
      ${createCodeBlock(`// Matrix 90-degree rotation (JavaScript)
function rotateMatrix90(matrix) {
  const n = matrix.length;
  const rotated = Array(n).fill().map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      rotated[j][n - 1 - i] = matrix[i][j];
    }
  }

  return rotated;
}

// Usage
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log(rotateMatrix90(matrix));
/* Output:
[[7, 4, 1],
 [8, 5, 2],
 [9, 6, 3]] */`, 'javascript')}
    `,
    slug: 'matrix-operations-transformations',
    week: 5,
    link: 'https://www.youtube.com/watch?v=t5BlpVGH1ok',
    source: 'YouTube',
    resourceSections: [
      {
        title: '🎥 Video Tutorials',
        description: 'Comprehensive video tutorials on matrix operations and transformations',
        sectionType: 'video-courses',
        icon: '🎥',
        resources: [
          {
            title: 'Rotating Matrix 90 Degrees',
            link: 'https://www.youtube.com/watch?v=t5BlpVGH1ok',
            type: 'Video Tutorial • Matrix Rotation',
            emoji: '🎥'
          },
          {
            title: 'Matrix Inverse',
            link: 'https://www.youtube.com/watch?v=mrXcNVB0l1Y',
            type: 'Video Tutorial • Matrix Inversion',
            emoji: '🎥'
          },
          {
            title: 'Converting Matrix From 2D to 1D',
            link: 'https://www.youtube.com/watch?v=xU787WDlpx0',
            type: 'Video Tutorial • Matrix Conversion',
            emoji: '🎥'
          },
          {
            title: 'Converting Matrix From 1D to 2D',
            link: 'https://www.youtube.com/watch?v=mFk44r6JULE',
            type: 'Video Tutorial • Matrix Conversion',
            emoji: '🎥'
          },
          {
            title: 'Identify If Matrix Is Symmetric',
            link: 'https://www.youtube.com/watch?v=DOjSrEA0geY',
            type: 'Video Tutorial • Matrix Properties',
            emoji: '🎥'
          }
        ]
      }
    ]
  },
  // ========== NEW DSA RESOURCES FOR WEEK 6 ==========
  {
    id: '17',
    title: 'Stack Data Structure - Complete Tutorial',
    description: 'Master stack implementation, operations, and applications with comprehensive examples and practical use cases.',
    date: '2025-10-04',
    tags: ['Stack', 'Data Structure', 'LIFO', 'DSA'],
    category: 'dsa',
    level: 'beginner',
    type: 'youtube',
    author: {
      name: 'Bro Code',
      avatar: '/avatars/stack-tutorial.jpg'
    },
    readTime: '18 min',
    image: '/blog/stack-data-structure.jpg',
    content: `
      ${createContentSection('Introduction', 'A stack is a linear data structure that follows the Last In, First Out (LIFO) principle. Understanding stacks is essential for algorithm design and problem-solving.')}

      ${createContentSection('Stack Fundamentals', 'Core stack concepts and operations:')}
      ${createFeatureList([
        '<strong>LIFO Principle</strong> - Last In, First Out data access pattern',
        '<strong>Basic Operations</strong> - Push, pop, peek, and isEmpty',
        '<strong>Implementation</strong> - Array-based and linked list implementations',
        '<strong>Applications</strong> - Function calls, expression evaluation, backtracking'
      ])}

      ${createContentSection('Stack Implementation Example', 'Array-based stack implementation:')}
      ${createCodeBlock(`// Stack Implementation (JavaScript)
class Stack {
  constructor() {
    this.items = [];
  }

  // Add element to top of stack
  push(element) {
    this.items.push(element);
  }

  // Remove and return top element
  pop() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items.pop();
  }

  // Return top element without removing
  peek() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items[this.items.length - 1];
  }

  // Check if stack is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Return stack size
  size() {
    return this.items.length;
  }
}

// Usage
const stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
console.log(stack.pop()); // 30
console.log(stack.peek()); // 20`, 'javascript')}
    `,
    slug: 'stack-data-structure-tutorial',
    week: 6,
    link: 'https://youtu.be/O1KeXo8lE8A?si=W0uXMme2fSM6fYg_',
    source: 'YouTube',
    resourceSections: [
      {
        title: '🎥 Video Tutorials',
        description: 'Comprehensive video tutorial on stack data structure',
        sectionType: 'video-courses',
        icon: '🎥',
        resources: [
          {
            title: 'Stacks Tutorial',
            link: 'https://youtu.be/O1KeXo8lE8A?si=W0uXMme2fSM6fYg_',
            type: 'Video Tutorial • Complete Guide',
            emoji: '🎥'
          }
        ]
      }
    ]
  },
  // ========== NEW DSA RESOURCES FOR WEEK 7 ==========
  {
    id: '18',
    title: 'Queue Data Structure - Complete Guide',
    description: 'Master queue implementation, operations, and variants including circular queues, priority queues, and deque with practical examples.',
    date: '2025-10-11',
    tags: ['Queue', 'Data Structure', 'FIFO', 'Circular Queue', 'Priority Queue', 'DSA'],
    category: 'dsa',
    level: 'intermediate',
    type: 'youtube',
    author: {
      name: 'Multiple Instructors',
      avatar: '/avatars/queue-guide.jpg'
    },
    readTime: '35 min',
    image: '/blog/queue-data-structure.jpg',
    content: `
      ${createContentSection('Introduction', 'A queue is a linear data structure that follows the First In, First Out (FIFO) principle. Queues are fundamental for managing processes, scheduling, and breadth-first search algorithms.')}

      ${createContentSection('Queue Types & Operations', 'Different queue implementations and their use cases:')}
      ${createFeatureList([
        '<strong>Basic Queue</strong> - Standard FIFO implementation with enqueue/dequeue',
        '<strong>Circular Queue</strong> - Efficient memory usage with wrap-around',
        '<strong>Priority Queue</strong> - Elements processed based on priority',
        '<strong>Double-Ended Queue (Deque)</strong> - Operations from both ends'
      ])}

      ${createContentSection('Queue Implementation Example', 'Array-based queue implementation:')}
      ${createCodeBlock(`// Queue Implementation (JavaScript)
class Queue {
  constructor() {
    this.items = [];
    this.front = 0;
    this.rear = 0;
  }

  // Add element to the rear
  enqueue(element) {
    this.items[this.rear] = element;
    this.rear++;
  }

  // Remove and return front element
  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    const item = this.items[this.front];
    this.front++;
    return item;
  }

  // Return front element without removing
  peek() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[this.front];
  }

  // Check if queue is empty
  isEmpty() {
    return this.front >= this.rear;
  }

  // Return queue size
  size() {
    return this.rear - this.front;
  }
}

// Usage
const queue = new Queue();
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
console.log(queue.dequeue()); // 10
console.log(queue.peek()); // 20`, 'javascript')}
    `,
    slug: 'queue-data-structure-guide',
    week: 7,
    link: 'https://youtu.be/zp6pBNbUB2U?si=eOqijR1T0aZ1LRRb',
    source: 'YouTube',
    resourceSections: [
      {
        title: '🎥 Video Tutorials',
        description: 'Comprehensive video tutorials covering all aspects of queue data structures',
        sectionType: 'video-courses',
        icon: '🎥',
        resources: [
          {
            title: 'Queue Introduction',
            link: 'https://youtu.be/zp6pBNbUB2U?si=eOqijR1T0aZ1LRRb',
            type: 'Video Tutorial • Queue Basics',
            emoji: '🎥'
          },
          {
            title: 'Queue Operations (Enqueue, Dequeue, Peek, Display)',
            link: 'https://youtu.be/YqrFeU90Coo?si=fa2s7MrpUCo4QCAG',
            type: 'Video Tutorial • Queue Operations',
            emoji: '🎥'
          },
          {
            title: 'Circular Queue',
            link: 'https://youtu.be/dn01XST9-bI?si=3jvkMmHy-0wt98wp',
            type: 'Video Tutorial • Circular Implementation',
            emoji: '🎥'
          },
          {
            title: 'Queue Using Stack',
            link: 'https://youtu.be/EFO7bbFcOMw?si=LPCG5-bsiDNmv-bM',
            type: 'Video Tutorial • Stack-based Queue',
            emoji: '🎥'
          },
          {
            title: 'Priority Queue',
            link: 'https://youtu.be/wptevk0bshY?si=C0DGDvJrW49yZ_HY',
            type: 'Video Tutorial • Priority-based Queue',
            emoji: '🎥'
          },
          {
            title: 'Double Ended Queue (Deque)',
            link: 'https://youtu.be/pqg0SOPRlJ4?si=8kAQh0L79Jvlgama',
            type: 'Video Tutorial • Double-ended Queue',
            emoji: '🎥'
          },
          {
            title: 'Deque Implementation',
            link: 'https://youtu.be/WJres9mgiAk?si=P8swCRphTkDfpMty',
            type: 'Video Tutorial • Deque Implementation',
            emoji: '🎥'
          }
        ]
      }
    ]
  },
  {
    id: 'apt-001',
    title: 'Time and Work & Pipes & Cisterns Masterclass',
    description: 'Sharpen your skills with curated tutorials and quizzes covering Time & Work and Pipes & Cisterns topics.',
    date: '2025-08-21',
    tags: ['Time & Work', 'Pipes & Cisterns', 'Aptitude', 'Placement'],
    category: 'aptitude',
    level: 'beginner',
    type: 'youtube',
    author: {
      name: 'HackerEarth Aptitude Group',
      avatar: '/avatars/hackerearth-aptitude.jpg'
    },
    readTime: '15 min',
    image: '/blog/aptitude-time-work-pipes.jpg',
    content: `
      ${createContentSection('Introduction', 'Focus on Time & Work concepts and Pipes & Cisterns with video tutorials and quizzes to boost your placement readiness.')}
      ${createContentSection('Reference Videos', 'Watch these helpful videos for Week 1:')}
      ${createFeatureList([
        '<a href="https://youtu.be/o7pY9hCqDZk?si=Ct9doBmx9gp0kgyu" target="_blank">Time and Work Video 1</a>',
        '<a href="https://youtu.be/KE7tQf9spPg?si=6JKYxXiCadgQEyn2v" target="_blank">Time and Work Video 2</a>',
        '<a href="https://youtu.be/j6vo6d6H6Ho?si=PvxM4WEf96exQXxS" target="_blank">Pipes and Cisterns Video 1</a>',
        '<a href="https://youtu.be/mBtBD1N7ywQ?si=Z6EB23_x48NmFQrw" target="_blank">Pipes and Cisterns Video 2</a>'
      ])}
      ${createContentSection('Quizzes', 'Test your knowledge with these quizzes:')}
      ${createFeatureList([
        '<a href="https://forms.gle/PNCdykamhUVdBoD97" target="_blank">Time and Work Quiz</a>',
        '<a href="https://forms.gle/8hS9ffhyThsk1PkB7" target="_blank">Pipes and Cisterns Quiz</a>'
      ])}
    `,
    slug: 'time-work-pipes-aptitude-masterclass',
    week: 1,
    link: 'https://www.youtube.com/playlist?list=PLH9e0t9UpsHiLx8qph9f_R_jcYyCrSDct',
    source: 'HackerEarth Aptitude Group'
  },
  {
    id: 'apt-002',
    title: 'Speed, Distance & Trains Masterclass',
    description: 'Deep dive into Speed, Distance and Trains problems to sharpen problem-solving skills.',
    date: '2025-08-31',
    tags: ['Speed', 'Distance', 'Trains', 'Aptitude'],
    category: 'aptitude',
    level: 'beginner',
    type: 'youtube',
    author: {
      name: 'HackerEarth Aptitude Group',
      avatar: '/avatars/hackerearth-aptitude.jpg'
    },
    readTime: '15 min',
    image: '/blog/aptitude-speed-distance.jpg',
    content: `
      ${createContentSection('Introduction', 'Master speed, distance and trains concepts with video lectures and practice quizzes.')}
      ${createContentSection('Reference Videos', 'Key videos for Week 2:')}
      ${createFeatureList([
        '<a href="https://youtu.be/jzNxXm5twx4?si=RzHpg-5Zg0KWpr-t" target="_blank">Speed and Distance Video 1</a>',
        '<a href="https://youtu.be/DaNnu8BqzCM?si=Hfp6ApalfgKe9fYn" target="_blank">Speed and Distance Video 2</a>',
        '<a href="https://youtu.be/qHJ9UkIKji8?si=DM9CgNILrxyPTLly" target="_blank">Problems on Trains Video 1</a>',
        '<a href="https://youtu.be/nYuSAh-W9g?si=in2ZgweVdhbDnurh" target="_blank">Problems on Trains Video 2</a>'
      ])}
      ${createContentSection('Quizzes', 'Practice these quizzes:')}
      ${createFeatureList([
        '<a href="https://forms.gle/81PTcVpvJt9k1uoR7" target="_blank">Speed and Distance Quiz</a>'
      ])}
    `,
    slug: 'speed-distance-trains-masterclass',
    week: 2,
    link: 'https://www.youtube.com/playlist?list=PLH9e0t9UpsHiLx8qph9f_R_jcYyCrSDct',
    source: 'HackerEarth Aptitude Group'
  },
  {
    id: 'apt-003',
    title: 'Boats and Streams & Ages Masterclass',
    description: 'Learn Boats and Streams and Ages concepts with detailed videos and quizzes.',
    date: '2025-09-10',
    tags: ['Boats and Streams', 'Ages', 'Aptitude'],
    category: 'aptitude',
    level: 'beginner',
    type: 'youtube',
    author: {
      name: 'HackerEarth Aptitude Group',
      avatar: '/avatars/hackerearth-aptitude.jpg'
    },
    readTime: '15 min',
    image: '/blog/aptitude-boats-streams.jpg',
    content: `
      ${createContentSection('Introduction', 'Detailed study on Boats and Streams, and Ages problems with practice quizzes provided.')}
      ${createContentSection('Reference Videos', 'Week 3 video resources:')}
      ${createFeatureList([
        '<a href="https://youtu.be/-EdJ4kAW-j4" target="_blank">Boats and Streams Video 1</a>',
        '<a href="https://youtu.be/HUMISdejRmwY" target="_blank">Boats and Streams Video 2</a>',
        '<a href="https://youtu.be/HYyPAxHAJyk" target="_blank">Ages Video 1</a>',
        '<a href="https://youtu.be/tJHl73PBnwY" target="_blank">Ages Video 2</a>'
      ])}
      ${createContentSection('Quizzes', 'Check your skills with:')}
      ${createFeatureList([
        '<a href="https://forms.gle/TpJwqUymjAcvQ6qx5" target="_blank">Boats and Streams Quiz</a>',
        '<a href="https://forms.gle/E1gmeSEeD369eFsBA" target="_blank">Ages Quiz</a>'
      ])}
    `,
    slug: 'boats-streams-ages-masterclass',
    week: 3,
    link: 'https://www.youtube.com/playlist?list=PLH9e0t9UpsHiLx8qph9f_R_jcYyCrSDct',
    source: 'HackerEarth Aptitude Group'
  },
  {
    id: 'apt-004',
    title: 'Ratio, Proportion & Partnership Masterclass',
    description: 'Practice Ratio, Proportion, and Partnership problems with videos and interactive quizzes.',
    date: '2025-09-20',
    tags: ['Ratio', 'Proportion', 'Partnership', 'Aptitude'],
    category: 'aptitude',
    level: 'beginner',
    type: 'youtube',
    author: {
      name: 'HackerEarth Aptitude Group',
      avatar: '/avatars/hackerearth-aptitude.jpg'
    },
    readTime: '15 min',
    image: '/blog/aptitude-ratio-proportion.jpg',
    content: `
      ${createContentSection('Introduction', 'Master Ratio, Proportion, and Partnership problems to ace aptitude tests.')}
      ${createContentSection('Reference Videos', 'Week 4 learning content:')}
      ${createFeatureList([
        '<a href="https://youtu.be/jfoJBivWlnQ" target="_blank">Ratio and Proportion Video 1</a>',
        '<a href="https://youtu.be/dswJYy6XeD0" target="_blank">Partnership Video 1</a>'
      ])}
      ${createContentSection('Quizzes', 'Challenge yourself with:')}
      ${createFeatureList([
        '<a href="https://forms.gle/8PvPe3Kf4nqS81y88" target="_blank">Ratio and Proportion Quiz</a>',
        '<a href="https://forms.gle/xRK68TmgK9FNMsjp7" target="_blank">Partnership Quiz</a>'
      ])}
    `,
    slug: 'ratio-proportion-partnership-masterclass',
    week: 4,
    link: 'https://www.youtube.com/playlist?list=PLH9e0t9UpsHiLx8qph9f_R_jcYyCrSDct',
    source: 'HackerEarth Aptitude Group'
  },
  {
    id: 'apt-005',
    title: 'Simple and Compound Interest Masterclass',
    description: 'Explore the concepts of Simple and Compound Interest with exercises and quizzes.',
    date: '2025-10-01',
    tags: ['Interest', 'Simple Interest', 'Compound Interest', 'Aptitude'],
    category: 'aptitude',
    level: 'beginner',
    type: 'youtube',
    author: {
      name: 'HackerEarth Aptitude Group',
      avatar: '/avatars/hackerearth-aptitude.jpg'
    },
    readTime: '15 min',
    image: '/blog/aptitude-interest.jpg',
    content: `
      ${createContentSection('Introduction', 'Understand Simple and Compound Interest formulas and application through videos and quizzes.')}
      ${createContentSection('Reference Videos', 'Week 5 tutorials:')}
      ${createFeatureList([
        '<a href="https://youtu.be/e2DPVTHC8so" target="_blank">Simple Interest Video</a>',
        '<a href="https://youtu.be/kD0Qi-mTokc" target="_blank">Compound Interest Video</a>'
      ])}
      ${createContentSection('Quizzes', 'Practice quizzes:')}
      ${createFeatureList([
        '<a href="https://forms.gle/V7yGHEpCoBUzZmxKA" target="_blank">Simple Interest Quiz</a>',
        '<a href="https://forms.gle/xU1RjeiSsz3G5DJ76" target="_blank">Compound Interest Quiz</a>'
      ])}
    `,
    slug: 'simple-compound-interest-masterclass',
    week: 5,
    link: 'https://www.youtube.com/playlist?list=PLH9e0t9UpsHiLx8qph9f_R_jcYyCrSDct',
    source: 'HackerEarth Aptitude Group'
  },
  {
    id: 'apt-006',
    title: 'Permutations, Combinations & Probability Masterclass',
    description: 'Master Permutations, Combinations, and Probability through video lectures and quizzes.',
    date: '2025-10-07',
    tags: ['Permutations', 'Combinations', 'Probability', 'Aptitude'],
    category: 'aptitude',
    level: 'beginner',
    type: 'youtube',
    author: {
      name: 'HackerEarth Aptitude Group',
      avatar: '/avatars/hackerearth-aptitude.jpg'
    },
    readTime: '15 min',
    image: '/blog/aptitude-permutations-probability.jpg',
    content: `
      ${createContentSection('Introduction', 'Learn Permutations, Combinations, and Probability fundamentals vital for aptitude exams.')}
      ${createContentSection('Reference Videos', 'Week 6 videos:')}
      ${createFeatureList([
        '<a href="https://youtu.be/gTriJtb1xg" target="_blank">Permutations and Combinations Video</a>',
        '<a href="https://youtu.be/bDA1uAPDjk" target="_blank">Probability Video</a>'
      ])}
      ${createContentSection('Quizzes', 'Test your knowledge:')}
      ${createFeatureList([
        '<a href="https://forms.gle/uVci5pVfgEJcnRZa6" target="_blank">Permutations and Combinations Quiz</a>',
        '<a href="https://forms.gle/QBJHDp2Rk5NpppZz9" target="_blank">Probability Quiz</a>'
      ])}
    `,
    slug: 'permutations-combinations-probability-masterclass',
    week: 6,
    link: 'https://www.youtube.com/playlist?list=PLH9e0t9UpsHiLx8qph9f_R_jcYyCrSDct',
    source: 'HackerEarth Aptitude Group'
  },
  {
    id: 'apt-007',
    title: 'Number Systems & Algebra Masterclass',
    description: 'Cover Number Systems and Algebra topics with video tutorials, quizzes, and practice questions.',
    date: '2025-10-13',
    tags: ['Number Systems', 'Algebra', 'Aptitude'],
    category: 'aptitude',
    level: 'beginner',
    type: 'youtube',
    author: {
      name: 'HackerEarth Aptitude Group',
      avatar: '/avatars/hackerearth-aptitude.jpg'
    },
    readTime: '15 min',
    image: '/blog/aptitude-numbers-algebra.jpg',
    content: `
      ${createContentSection('Introduction', 'Intensive coverage of Number Systems and Algebra with curated exercises for placements.')}
      ${createContentSection('Reference Videos', 'Week 7 video resources:')}
      ${createFeatureList([
        '<a href="https://www.youtube.com/watch?v=bJCdFBfSR5Q" target="_blank">Number Systems Video</a>',
        '<a href="https://www.youtube.com/watch?v=TV9rQm15sWo" target="_blank">Algebra Video</a>'
      ])}
      ${createContentSection('Quizzes', 'Try these quizzes based on Number Systems and Algebra:')}
      ${createFeatureList([
        '<a href="https://forms.gle/4vFCtgkxzwD6kJHB7" target="_blank">Number Systems Quiz</a>',
        '<a href="https://forms.gle/rspGJ5qTMLyVr9zE9" target="_blank">Algebra Quiz</a>'
      ])}
    `,
    slug: 'number-systems-algebra-masterclass',
    week: 7,
    link: 'https://www.youtube.com/playlist?list=PLH9e0t9UpsHiLx8qph9f_R_jcYyCrSDct',
    source: 'HackerEarth Aptitude Group'
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

export const getResourcesByWeek = (week: number): ResourceSection[] => {
  const weekResources = {
    1: week1Resources,
    2: week2Resources,
    3: week3Resources,
    4: week4Resources
  };
  return weekResources[week as keyof typeof weekResources] || [];
};

export default blogPosts;