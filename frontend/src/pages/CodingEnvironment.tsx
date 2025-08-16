import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Maximize2, 
  Minimize2,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Terminal,
  FileText,
  Lightbulb,
  Users,
  Trophy,
  ArrowLeft,
  Copy,
  Check
} from 'lucide-react';

const CodingEnvironment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState(`// Welcome to HackerEarth Coding Environment
// Problem: Two Sum
// Write your solution below

function twoSum(nums, target) {
    // Your code here
    
}

// Test your solution
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]`);
  
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [activeTab, setActiveTab] = useState('problem');
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('javascript');
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const codeEditorRef = useRef(null);

  // Problem data
  const problemData = {
    title: "Two Sum",
    difficulty: "Easy",
    points: 50,
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists."
    ],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Again, the best way would be to use a HashMap to store the array elements and their indices.",
      "In a single pass, check if target - current element exists in the HashMap."
    ]
  };

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    
    // Simulate code execution
    setTimeout(() => {
      try {
        // Simple test execution simulation
        const testCases = [
          { input: [2, 7, 11, 15], target: 9, expected: [0, 1] },
          { input: [3, 2, 4], target: 6, expected: [1, 2] },
          { input: [3, 3], target: 6, expected: [0, 1] }
        ];

        let results = [];
        let allPassed = true;

        testCases.forEach((test, index) => {
          // Simulate test execution
          const passed = Math.random() > 0.3; // 70% chance of passing
          results.push({
            id: index + 1,
            input: `nums = [${test.input.join(', ')}], target = ${test.target}`,
            expected: `[${test.expected.join(', ')}]`,
            actual: passed ? `[${test.expected.join(', ')}]` : '[0, 0]',
            passed
          });
          if (!passed) allPassed = false;
        });

        setTestResults(results);
        
        if (allPassed) {
          setOutput('✅ All test cases passed!\n\nExecution completed successfully.\nTime complexity: O(n)\nSpace complexity: O(n)');
        } else {
          setOutput('❌ Some test cases failed.\n\nPlease check your logic and try again.\nHint: Consider using a hash map for O(n) solution.');
        }
      } catch (error) {
        setOutput(`❌ Runtime Error:\n${error.message}`);
        setTestResults([]);
      }
      setIsRunning(false);
    }, 2000);
  };

  const resetCode = () => {
    setCode(`// Welcome to HackerEarth Coding Environment
// Problem: Two Sum
// Write your solution below

function twoSum(nums, target) {
    // Your code here
    
}

// Test your solution
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]`);
    setOutput('');
    setTestResults([]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submitSolution = () => {
    alert('Solution submitted successfully! 🎉\n\nYou earned 50 points!\nCheck the leaderboard to see your ranking.');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen pt-16 ml-16'} ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {problemData.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problemData.difficulty)}`}>
                {problemData.difficulty}
              </span>
              <div className="flex items-center space-x-1 text-yellow-600">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-medium">{problemData.points} pts</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Timer */}
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
              timeLeft < 300 ? 'bg-red-100 text-red-700' : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
            </div>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className={`mt-4 p-4 rounded-lg border ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Theme
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Font Size
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value={12}>12px</option>
                  <option value={14}>14px</option>
                  <option value={16}>16px</option>
                  <option value={18}>18px</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Problem Description */}
        <div className={`w-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} overflow-y-auto`}>
          {/* Tabs */}
          <div className={`flex border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            {[
              { id: 'problem', label: 'Problem', icon: FileText },
              { id: 'hints', label: 'Hints', icon: Lightbulb },
              { id: 'discuss', label: 'Discuss', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? theme === 'dark'
                        ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700'
                        : 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : theme === 'dark'
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'problem' && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Description
                  </h2>
                  <p className={`leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {problemData.description}
                  </p>
                </div>

                <div>
                  <h3 className={`text-md font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Examples
                  </h3>
                  {problemData.examples.map((example, index) => (
                    <div key={index} className={`mb-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="space-y-2">
                        <div>
                          <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Input: </span>
                          <code className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{example.input}</code>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Output: </span>
                          <code className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{example.output}</code>
                        </div>
                        <div>
                          <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Explanation: </span>
                          <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{example.explanation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className={`text-md font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Constraints
                  </h3>
                  <ul className="space-y-1">
                    {problemData.constraints.map((constraint, index) => (
                      <li key={index} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        • {constraint}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Hints
                  </h2>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      theme === 'dark' 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{showHint ? 'Hide' : 'Show'} Hints</span>
                  </button>
                </div>
                
                {showHint && (
                  <div className="space-y-3">
                    {problemData.hints.map((hint, index) => (
                      <div key={index} className={`p-4 rounded-lg border-l-4 border-yellow-500 ${
                        theme === 'dark' ? 'bg-yellow-900/20 text-yellow-200' : 'bg-yellow-50 text-yellow-800'
                      }`}>
                        <div className="flex items-start space-x-2">
                          <Lightbulb className="w-4 h-4 mt-0.5 text-yellow-500" />
                          <span className="text-sm">{hint}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'discuss' && (
              <div className="text-center py-12">
                <Users className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Discussion Coming Soon
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Connect with other students to discuss solutions and approaches.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className={`w-1/2 flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Editor Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Code Editor
              </span>
              <span className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                {language.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={copyCode}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              
              <button
                onClick={resetCode}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <textarea
              ref={codeEditorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full h-full p-4 font-mono resize-none focus:outline-none ${
                theme === 'dark' 
                  ? 'bg-gray-900 text-gray-100' 
                  : 'bg-white text-gray-900'
              }`}
              style={{ fontSize: `${fontSize}px` }}
              placeholder="Write your code here..."
            />
          </div>

          {/* Action Buttons */}
          <div className={`flex items-center justify-between px-4 py-3 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center space-x-3">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run Code</span>
                  </>
                )}
              </button>
              
              <button
                onClick={submitSolution}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className={`h-48 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <div className={`flex items-center px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <Terminal className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Output
              </span>
            </div>
            
            <div className="h-full overflow-y-auto">
              {testResults.length > 0 ? (
                <div className="p-4 space-y-3">
                  {testResults.map((result) => (
                    <div key={result.id} className={`p-3 rounded-lg border ${
                      result.passed 
                        ? theme === 'dark' ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                        : theme === 'dark' ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {result.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          result.passed 
                            ? 'text-green-700' 
                            : 'text-red-700'
                        }`}>
                          Test Case {result.id} {result.passed ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <div>Input: {result.input}</div>
                        <div>Expected: {result.expected}</div>
                        <div>Actual: {result.actual}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4">
                  <pre className={`text-sm font-mono whitespace-pre-wrap ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {output || 'Click "Run Code" to see output here...'}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingEnvironment;