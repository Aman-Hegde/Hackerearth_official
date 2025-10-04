import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, CheckCircle, Sun, Moon, ChevronLeft, ChevronRight, Code, Cpu, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const classNames = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Domain-specific carousel images
const carouselImages = [
  {
    light: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=800&h=1000&fit=crop',
    dark: 'https://images.unsplash.com/photo-1581276879432-15e50529f34b?w=800&h=1000&fit=crop&auto=format&q=80',
    title: 'Web Development',
    description: 'Build modern, responsive web applications',
    icon: <Code className="w-8 h-8 text-blue-400 mb-3" />,
    gradient: 'from-blue-900/80 to-purple-900/60'
  },
  {
    light: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=1000&fit=crop',
    dark: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=1000&fit=crop&auto=format&q=80',
    title: 'Data Structures & Algorithms',
    description: 'Master problem-solving and algorithmic thinking',
    icon: <Cpu className="w-8 h-8 text-green-400 mb-3" />,
    gradient: 'from-green-900/80 to-blue-900/60'
  },
  {
    light: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=1000&fit=crop',
    dark: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=1000&fit=crop&auto=format&q=80',
    title: 'Aptitude & Reasoning',
    description: 'Develop critical thinking and analytical skills',
    icon: <Brain className="w-8 h-8 text-purple-400 mb-3" />,
    gradient: 'from-purple-900/80 to-pink-900/60'
  }
];

const LoginPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Carousel auto-rotate effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!window.google && !document.getElementById('google-identity')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.id = 'google-identity';
      document.body.appendChild(script);
    }
  }, []);

  const validateEmail = (email: string) => {
    return email.endsWith('@nmamit.in');
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email must end with @nmamit.in';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);

    if (!window.google?.accounts?.id) {
      alert('Google Sign-In not loaded yet. Please wait or try again.');
      setIsLoading(false);
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
    });

    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setIsLoading(false);
      }
    });
  };

  const handleGoogleCallback = async (response: any) => {
    setIsLoading(true);
    try {
      if (!response?.credential) {
        throw new Error('No Google Credential received.');
      }

      const BASE_URL = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: response.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        login(data.email, data.name);
        navigate('/');
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('Sign-in failed, please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);

    setTimeout(() => {
      if (isLogin) {
        login(formData.email, formData.name || formData.email.split('@')[0]);
      } else {
        login(formData.email, formData.name);
      }
      setIsLoading(false);
      navigate('/');
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Theme Toggle Button - Top Right */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-gray-100/80 dark:bg-black/80 backdrop-blur-sm border border-gray-300/50 dark:border-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors shadow-lg"
      >
        {isDark ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-gray-700" />}
      </button>

      {/* Left Panel - Domain-Specific Carousel */}
      <div className="relative hidden lg:block overflow-hidden bg-black">
        {/* Carousel Container */}
        <div className="relative w-full h-full">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={isDark ? image.dark : image.light}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay matching domain theme */}
              <div className={`absolute inset-0 bg-gradient-to-br ${image.gradient} opacity-30`} />
              
              {/* Additional dark overlay for better contrast */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Content */}
              <div className="absolute bottom-8 left-8 z-20 max-w-lg text-white">
                <div className="mb-4">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4">
                    <span className="text-white/90 text-sm font-light">✨ Featured Domain</span>
                  </div>
                  <div className="flex items-center mb-3">
                    {image.icon}
                    <h2 className="text-4xl font-bold text-white ml-2">{image.title}</h2>
                  </div>
                  <p className="text-white/80 text-lg">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-8 right-8 z-20 flex gap-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-gray-50 dark:bg-black">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HackerEarth
            </span>
          </a>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to access all learning domains
              </p>
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Google Sign In Button */}
              <button 
                type="button" 
                className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none
                           h-12 px-6 py-3 w-full
                           border border-gray-300 dark:border-gray-700 
                           bg-white dark:bg-gray-900
                           hover:bg-gray-50 dark:hover:bg-gray-800
                           text-gray-900 dark:text-gray-100
                           shadow-sm hover:shadow-md transition-shadow" 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-3">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 dark:bg-black text-gray-500 dark:text-gray-400">
                    NMAMIT Students Only
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <Code className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-300">Web Dev</p>
                </div>
                <div className="rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <Cpu className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-300">DSA</p>
                </div>
                <div className="rounded-xl p-4 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                  <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-300">Aptitude</p>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access all domains including Web Development, DSA, and Aptitude
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;