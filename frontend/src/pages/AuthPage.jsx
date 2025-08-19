import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff, Moon, Sun, CheckCircle } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, signup } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleGoogleAuth = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const result = isLogin 
        ? await login(email, password)
        : await signup(email, password);

      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-background-dark' : 'bg-background-light'
    } flex items-center justify-center p-4`}>
      
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
            : 'bg-white text-gray-600 hover:bg-gray-50'
        } shadow-lg hover:shadow-xl`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Main Auth Card */}
      <div className={`w-full max-w-md ${
        isDark ? 'bg-gray-800' : 'bg-surface'
      } rounded-2xl shadow-2xl p-8 transition-all duration-300 animate-scale-in`}>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-600 rounded-full">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className={`text-3xl font-bold ${
            isDark ? 'text-white' : 'text-text-primary'
          } mb-2`}>
            TodoMaster
          </h1>
          <p className={`${
            isDark ? 'text-gray-300' : 'text-text-secondary'
          }`}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Auth Toggle */}
        <div className="flex mb-6">
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-l-lg font-medium transition-all duration-200 ${
              isLogin
                ? 'bg-primary-600 text-white'
                : isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
            className={`flex-1 py-2 px-4 rounded-r-lg font-medium transition-all duration-200 ${
              !isLogin
                ? 'bg-primary-600 text-white'
                : isDark
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-slide-down">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-text-primary'
            }`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary-500'
                  : 'bg-white border-gray-300 text-text-primary placeholder-gray-500 focus:border-primary-500'
              } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none`}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-text-primary'
            }`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary-500'
                    : 'bg-white border-gray-300 text-text-primary placeholder-gray-500 focus:border-primary-500'
                } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none`}
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                } transition-colors duration-200`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-text-primary'
              }`}>
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary-500'
                    : 'bg-white border-gray-300 text-text-primary placeholder-gray-500 focus:border-primary-500'
                } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none`}
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Google OAuth Button */}
        <div className="mt-6">
          <div className={`relative flex items-center justify-center mb-4`}>
            <div className={`border-t flex-grow ${
              isDark ? 'border-gray-600' : 'border-gray-300'
            }`}></div>
            <span className={`mx-4 text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              or
            </span>
            <div className={`border-t flex-grow ${
              isDark ? 'border-gray-600' : 'border-gray-300'
            }`}></div>
          </div>
          
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-none ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Demo Info */}
        <div className={`mt-6 p-4 rounded-lg ${
          isDark ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'
        } border`}>
          <p className={`text-sm ${
            isDark ? 'text-gray-300' : 'text-blue-800'
          } text-center`}>
            💡 <strong>Demo Mode:</strong> Enter any email and password to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
