import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/Logo';
import { ArrowLeft } from 'lucide-react';
import homeImg from '../assets/home.png';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.endsWith('@gmail.com')) {
      setError('Only Gmail accounts are accepted');
      setLoading(false);
      return;
    }

    try {
      await signIn(email, password);
      console.log('Sign in completed');
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
      setLoading(false);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block">
        <img src={homeImg} alt="Home" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col min-h-screen px-4 py-8">
        <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <div className="flex justify-center mb-8">
            <Logo className="h-20 w-auto object-contain" />
          </div>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 text-center mb-2">Welcome back</h1>
          <p className="text-gray-600 text-center">Sign in to your Feedquire account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Gmail Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@gmail.com"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span>Signing in</span>
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-gray-900 font-medium hover:underline">
            Sign up
          </Link>
        </p>

        
        </div>
      </div>
    </div>
  );
}
