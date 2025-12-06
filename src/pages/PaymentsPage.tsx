import { DashboardLayout } from '../components/DashboardLayout';
import { CheckCircle2, Clock, CreditCard, Mail, Edit2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function PaymentsPage() {
  const { profile, refreshProfile } = useAuth();
  const [showPaypalModal, setShowPaypalModal] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState(profile?.paypal_email || '');
  const [saving, setSaving] = useState(false);
  const demoPayments = [
    {
      id: '1',
      date: '2024-12-01',
      amount: 15.75,
      method: 'Bank Transfer',
      status: 'completed',
      reference: 'PAY-2024-001'
    },
    {
      id: '2', 
      date: '2024-11-15',
      amount: 8.50,
      method: 'PayPal',
      status: 'completed',
      reference: 'PAY-2024-002'
    },
    {
      id: '3',
      date: '2024-11-01',
      amount: 22.25,
      method: 'Bank Transfer',
      status: 'completed',
      reference: 'PAY-2024-003'
    }
  ];

  return (
    <DashboardLayout>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-6 h-20 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-gray-900">Payment History</h1>
        </div>
      </div>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-8">
            <h3 className="font-medium text-gray-900 mb-3">Payment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Bank Transfer</p>
                  <p className="text-gray-600 text-sm">Direct deposit to your bank account</p>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">PayPal</p>
                  <p className="text-gray-600 text-sm">
                    {profile?.paypal_email ? profile.paypal_email : 'PayPal account'}
                  </p>
                </div>
                <button
                  onClick={() => setShowPaypalModal(true)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Edit2 size={14} />
                  {profile?.paypal_email ? 'Edit' : 'Setup'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CreditCard size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-green-900 mb-1">Available for Withdrawal</h3>
                  <p className="text-2xl font-bold text-green-900 mb-1">$0.00</p>
                  <p className="text-green-800 text-sm">Will be paid on 30th of this month</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Automatic Payouts</h3>
                  <p className="text-blue-800 text-sm">
                    We process automatic payouts to your bank account or PayPal monthly. 
                    Payments are typically processed every 30th of the month.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-2">No payment history yet</p>
            <p className="text-gray-500 text-sm">Your payments will appear here after monthly processing on the 30th</p>
          </div>
        </div>

        {showPaypalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup PayPal Account</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gmail Account (PayPal)
                </label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    setSaving(true);
                    try {
                      const { error } = await supabase
                        .from('profiles')
                        .update({ paypal_email: paypalEmail })
                        .eq('user_id', profile?.user_id);
                      
                      if (error) throw error;
                      await refreshProfile();
                      setShowPaypalModal(false);
                    } catch (err) {
                      console.error('Error saving PayPal email:', err);
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving || !paypalEmail.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setShowPaypalModal(false);
                    setPaypalEmail(profile?.paypal_email || '');
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}