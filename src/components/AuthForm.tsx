import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import { CheckItLogo } from './CheckItLogo';
import { ThemeToggle } from './ThemeToggle';
import { z } from 'zod';

const AuthSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormData = z.infer<typeof AuthSchema>;

export function AuthForm() {
  const { signUp, signIn, loading } = useAuth();
  const { isDark } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setAuthError('');
    setMessage('');

    try {
      const validatedData = AuthSchema.parse(formData);
      
      if (isSignUp) {
        const result = await signUp(validatedData.email, validatedData.password);
        if (result.success) {
          setMessage('Check your email for verification link!');
        } else {
          setAuthError(result.error || 'Sign up failed');
        }
      } else {
        const result = await signIn(validatedData.email, validatedData.password);
        if (!result.success) {
          setAuthError(result.error || 'Sign in failed');
        }
      }
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setAuthError('');
    setMessage('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-md w-full space-y-8 p-6">
        {/* Theme Toggle - Top Right */}
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        
        <div className="text-center">
          <CheckItLogo size="lg" showText={true} className="justify-center mb-6" />
          <h2 className={`text-3xl font-bold transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className={`mt-2 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {isSignUp 
              ? 'Sign up to start managing your tasks' 
              : 'Sign in to access your todos'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                errors.email 
                  ? 'border-red-500' 
                  : isDark 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900'
              }`}
              placeholder="Enter your email"
              required
            />
            {errors.email && <p className={`text-sm mt-1 transition-colors duration-300 ${
              isDark ? 'text-red-400' : 'text-red-500'
            }`}>{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                errors.password 
                  ? 'border-red-500' 
                  : isDark 
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-300 bg-white text-gray-900'
              }`}
              placeholder={isSignUp ? 'Create a password (min 6 characters)' : 'Enter your password'}
              required
            />
            {errors.password && <p className={`text-sm mt-1 transition-colors duration-300 ${
              isDark ? 'text-red-400' : 'text-red-500'
            }`}>{errors.password}</p>}
          </div>

          {authError && (
            <div className={`border px-4 py-3 rounded-md transition-colors duration-300 ${
              isDark 
                ? 'bg-red-900/20 border-red-800 text-red-400'
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              {authError}
            </div>
          )}

          {message && (
            <div className={`border px-4 py-3 rounded-md transition-colors duration-300 ${
              isDark 
                ? 'bg-green-900/20 border-green-800 text-green-400'
                : 'bg-green-50 border-green-200 text-green-600'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className={`text-sm transition-colors duration-300 ${
                isDark 
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}