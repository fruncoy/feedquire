
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import homeImg from '../assets/home.png';

export function CompanySignupPage() {
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading, company, refreshCompany } = useAuth();

  useEffect(() => {
    console.log('CompanySignupPage state:', { user, authLoading, company });
    // If user is already logged in, redirect to dashboard
    if (user && !authLoading) {
      if (company) {
        navigate('/company/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, company, navigate]);

  useEffect(() => {
    if (showSuccess && !authLoading) {
      const timeout = setTimeout(() => {
        navigate('/company/dashboard');
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [showSuccess, authLoading, navigate]);

  useEffect(() => {
    document.title = 'Company Sign Up - Feedquire';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!termsAccepted) {
      setError('You must agree to the terms to create an account');
      return;
    }

    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: companyEmail,
        password: password,
        options: {
          data: {
            full_name: companyName,
            is_company: true
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error('Failed to create user');

      await supabase.from('profiles').delete().eq('user_id', signUpData.user.id);

      const { error: companyError } = await supabase.from('companies').insert({
        user_id: signUpData.user.id,
        company_name: companyName,
        company_email: companyEmail,
        company_website: companyWebsite
      });

      if (companyError) throw companyError;

      // Refresh company data in AuthContext
      await refreshCompany();

      setShowSuccess(true);
      setLoading(false);
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

          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Create Company Account</h1>
            <p className="text-gray-600">Get human feedback for your software</p>
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
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-900 mb-2">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company name"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="companyEmail" className="block text-sm font-medium text-gray-900 mb-2">
                Company Email
              </label>
              <input
                id="companyEmail"
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="company@example.com"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-900 mb-2">
                Company Website (optional)
              </label>
              <input
                id="companyWebsite"
                type="url"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="https://yourcompany.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1">At least 8 characters</p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
                className="mt-1 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-900"
              />
              <label htmlFor="terms" className="text-xs text-gray-700 leading-relaxed">
                By creating a company account, you agree to our terms and conditions.
              </label>
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
                'Create Company Account'
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/company/login" className="text-gray-900 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
