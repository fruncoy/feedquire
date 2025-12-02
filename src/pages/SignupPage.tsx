import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from '../components/Logo';
import homeImg from '../assets/home.png';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!email.endsWith('@gmail.com')) {
      setError('Only Gmail accounts are accepted');
      return;
    }

    setLoading(true);

    try {
      await signUp(name, email, password);
      setShowSuccess(true);
      setLoading(false);
      // Redirect after showing success
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
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
            <Logo className="h-24 w-auto object-contain" />
          </div>

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-2">Create account</h1>
        <p className="text-gray-600 text-center">Join Feedquire and help shape the AI landscape</p>
      </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={20} />
              <div>
                <p className="text-sm font-medium text-green-800">Account created successfully!</p>
                <p className="text-xs text-green-700 mt-1">Redirecting to your dashboard...</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
            />
          </div>

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
            <p className="text-xs text-gray-600 mt-1">Only Gmail accounts are accepted</p>
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
            <p className="text-xs text-gray-600 mt-1">At least 8 characters</p>
          </div>

          

          <button
            type="submit"
            disabled={loading || showSuccess}
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span>Creating account</span>
              </>
            ) : showSuccess ? (
              'Account created!'
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-900 font-medium hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-xs text-gray-500 text-center mt-8 mb-4">
          By signing up, you agree to our Terms of Service and acknowledge our Privacy Policy
        </p>
        </div>
      </div>
    </div>
  );
}
