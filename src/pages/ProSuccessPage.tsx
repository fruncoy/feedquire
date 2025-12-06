import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';
import { CheckCircle } from 'lucide-react';

export function ProSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for upgrading to Pro. We'll be in contact with you within 28 days as we create your Pro account with premium benefits.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800">
              You'll receive an email confirmation shortly with next steps and what to expect during the setup process.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[#000150] text-white py-3 rounded-lg font-semibold hover:bg-[#000130] transition"
          >
            Return to Dashboard
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Redirecting automatically in 10 seconds...
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
