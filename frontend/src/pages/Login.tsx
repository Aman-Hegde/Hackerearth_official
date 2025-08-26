import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/hacker-earth-logo.png'
import { useTheme } from '../context/ThemeContext';
import RightPanelLogin from '../components/RightPanelLogin';
// ---- TypeScript fix: declare Google types ----
declare global {
  interface Window {
    google?: any;
  }
}

// ====== SET YOUR GOOGLE CLIENT ID HERE ======
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
// =============================================

const Login = () => {
  const { isDark } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Dynamically load Google Identity script ONCE
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

  // Main Google Sign-In handler
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

  // Manual fallback login (for dev only)
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

  return (
    <div className={`min-h-screen bg-gradient-to-br 
    ${isDark ? 'bg-black' : 'from-slate-50 via-blue-50 to-indigo-100'} 
    flex flex-col md:flex-row items-stretch`}>

      {/* Left Panel */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 z-10">
        {/* Left background pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${isDark ? 'bg-gradient-to-br from-blue-900/20 to-indigo-800/20' : 'bg-gradient-to-br from-blue-400/20 to-indigo-600/20'}`}></div>
        </div>
        <div className="max-w-md w-full space-y-8 relative z-10">
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse 
        ${isDark ? 'bg-gradient-to-br from-blue-900/20 to-indigo-800/20' : 'bg-gradient-to-br from-blue-400/20 to-indigo-600/20'}`}></div>
            <div
              className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse`}
              style={{ animationDelay: '1s', background: isDark ? 'linear-gradient(to top right, rgba(128,90,213,0.2), rgba(236,72,153,0.2))' : '' }}
            ></div>
          </div>

          <div className="max-w-md w-full mt-8 space-y-8 relative z-10">
            {/* Header */}
            <div className="text-center animate-fade-in-up">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img
                    src={logo}
                    alt="HackerEarth Logo"
                    width={100}
                    height={100}
                    className="w-10 h-8 rounded-xl object-contain"
                  />
                </div>
                <span className={`text-xl font-bold bg-gradient-to-r ${isDark ? 'from-white to-gray-300' : 'from-gray-900 to-gray-700'} bg-clip-text text-transparent`}>
                  HackerEarth
                </span>
              </div>
              <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Welcome to HackerEarth</h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sign in with your NMAMIT Google account</p>
            </div>

            {/* Google Sign In */}
            <div className={`${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-white/20'} backdrop-blur-sm rounded-2xl shadow-xl border p-8 animate-scale-in`}>
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className={`w-full flex items-center justify-center space-x-3 ${isDark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-700'} border-2 py-4 px-6 rounded-xl font-semibold hover:border-blue-500 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Continue with Google</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-6 text-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className={`w-full border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-2 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>NMAMIT Students Only</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Must use @nmamit.in email address</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure Google OAuth authentication</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Access to all club features</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full text-center text-sm text-gray-500 hover:text-blue-600 transition-colors dark:text-gray-400"
                >
                  Having trouble? Try manual login (Development only)
                </button>
              </div>

              {!isLogin && (
                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                      placeholder="Full Name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                      placeholder="your.name@nmamit.in"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                      placeholder="Password"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>
                  <div>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                      placeholder="Confirm Password"
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 text-center animate-fade-in">
              <div className={`backdrop-blur-sm rounded-xl p-4 border ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white/60 border-white/20'}`}>
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Secure</p>
              </div>
              <div className={`backdrop-blur-sm rounded-xl p-4 border ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white/60 border-white/20'}`}>
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Verified</p>
              </div>
              <div className={`backdrop-blur-sm rounded-xl p-4 border ${isDark ? 'bg-gray-800/60 border-gray-700' : 'bg-white/60 border-white/20'}`}>
                <User className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>NMAMIT Only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex items-center mx-2">
        <svg
          width="8"
          height="200"
          viewBox="0 0 8 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full"
        >
          <circle cx="4" cy="20" r="3" fill="#6366F1" fillOpacity="0.5" />
          <circle cx="4" cy="60" r="4" fill="#4F46E5" fillOpacity="0.4" />
          <circle cx="4" cy="100" r="3" fill="#4338CA" fillOpacity="0.3" />
          <circle cx="4" cy="140" r="4" fill="#6366F1" fillOpacity="0.2" />
          <circle cx="4" cy="180" r="3" fill="#4F46E5" fillOpacity="0.1" />
        </svg>
      </div>

      {/* Right Panel */}
      <RightPanelLogin />
    </div>
  );

};

export default Login;

