import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import PaystackPop from '@paystack/inline-js';

export function VerifyPaymentPage() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'ready' | 'loading' | 'payment_form' | 'processing' | 'success' | 'error'>('ready');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePaymentClick = async () => {
    if (!user) return;

    setLoading(true);
    setStatus('loading');

    // Simulate loading then show payment form
    setTimeout(() => {
      setStatus('payment_form');
      setLoading(false);
      
      // Initialize Paystack embedded in container
      const paystack = new PaystackPop();
      
      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: 13000, // KSh 130
        currency: 'KES',
        ref: `verify_${user.id}_${Date.now()}`,
        container: 'paystack-container', // Embed in specific div
        metadata: {
          user_id: user.id,
          purpose: 'account_verification'
        },
        onSuccess: async (transaction: any) => {
          console.log('Payment successful:', transaction);
          setStatus('processing');
          await updateUserStatus(transaction.reference);
        },
        onCancel: () => {
          console.log('Payment cancelled');
          setStatus('ready');
        },
        onError: (error: any) => {
          console.error('Payment error:', error);
          setStatus('error');
          setErrorMsg('Payment failed. Please try again.');
        }
      });
    }, 1500);
  };

  const updateUserStatus = async (reference: string) => {
    if (!user) return;
    
    try {
      // Update profile status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          account_status: '1Q3bF8vL1nT9pB6wR',
        })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw profileError;
      }

      // Try to update logs, but don't fail if it doesn't exist
      const { error: logError } = await supabase
        .from('logs')
        .upsert({
          user_id: user.id,
          status: 'ready_for_test',
          payment_verified_at: new Date().toISOString(),
          payment_reference: reference
        });

      if (logError) {
        console.warn('Log update failed (non-critical):', logError);
      }

      // Store payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          reference: reference,
          amount: 13000,
          currency: 'KES',
          status: 'success',
          verified_at: new Date().toISOString()
        });

      if (paymentError) {
        console.warn('Payment record failed (non-critical):', paymentError);
      }

      await refreshProfile();
      setStatus('success');

      setTimeout(() => {
        navigate('/assessment-test');
      }, 2000);
    } catch (err: any) {
      console.error('Status update error:', err);
      setStatus('error');
      setErrorMsg('Payment successful but verification failed. Please contact support.');
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Verify Your Account</h1>
          <p className="text-gray-600">Mark human verification complete to continue</p>
        </div>
        
        {status === 'success' ? (
          <div className="text-center max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Payment Verified!</h1>
            <p className="text-gray-600 mb-6">Your account has been verified. Redirecting to assessment...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 max-w-6xl">
            {/* Left Card - 60% */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6 lg:p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#000150] mb-4">Bypass the Anti-Bot Check</h2>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#000150] rounded-full"></div>
                      <span>Check Instant Access to Test</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#000150] rounded-full"></div>
                      <span>One-Time Non-Refundable Payment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#000150] rounded-full"></div>
                      <span>Fast & Seamless Checkout</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg font-medium text-gray-700">Total</span>
                    <span className="text-3xl font-bold text-[#000150]">$1</span>
                  </div>
                  <p className="text-gray-600 text-sm">Then free forever</p>
                </div>
              </div>
            </div>

            {/* Right Card - 40% */}
            <div className={`lg:col-span-2 bg-white rounded-xl border p-6 lg:p-8 transition-all duration-300 ${
              status === 'loading' || status === 'payment_form' 
                ? 'border-[#000150] shadow-lg shadow-[#000150]/20' 
                : 'border-gray-200'
            }`}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Payment</h3>
                  <p className="text-gray-600 text-sm">Secure checkout powered by Paystack</p>
                </div>

                {status === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700">{errorMsg}</p>
                  </div>
                )}

                {status === 'payment_form' ? (
                  <div>
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Payment</h3>
                      <p className="text-gray-600 text-sm">Enter your payment details below</p>
                    </div>
                    <div id="paystack-container" className="min-h-[300px] border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="w-8 h-8 border-4 border-[#000150] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">Loading payment form...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center space-y-3">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        By continuing, you agree to complete a one-time $1 verification payment used solely to confirm you are a real human and not an automated bot. This payment is non-refundable. Nothing will be deducted from your earnings at any point. You will always receive your full payout amounts.
                      </p>
                    </div>
                    
                    <button
                      onClick={handlePaymentClick}
                      disabled={loading || status === 'processing' || status === 'loading'}
                      className="w-full bg-[#000150] text-white py-4 rounded-lg font-semibold hover:bg-[#000130] disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {status === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Loading...
                        </span>
                      ) : status === 'processing' ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : (
                        'One Tap Access'
                      )}
                    </button>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Secure payment • SSL encrypted</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
