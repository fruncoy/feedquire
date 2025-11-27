import { DashboardLayout } from '../components/DashboardLayout';
import { Check, Crown } from 'lucide-react';

export function AccountPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Membership Level</h1>
            <p className="text-gray-600">Enjoy full features with your plan.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Plan */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 relative">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Basic</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">$0.00</span>
                  <span className="text-gray-600 ml-2">Free Forever</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">Great for those starting out.</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Submit tasks and wait for final qualification.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Task pricing is subsidized to allow multiple reviews.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">You can submit up to 20 tasks per month.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Withdrawals are processed on the 30th of each month.</span>
                </div>
              </div>



              <button className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-medium cursor-not-allowed">
                Included in your account
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-6 relative shadow-lg">


              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  Pro <Crown size={20} className="text-amber-600" />
                </h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600 ml-2">One-Off</span>
                </div>
                <p className="text-gray-700 text-sm mt-1">Maximize earnings with priority features.</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-white text-xs">⭐</span>
                  </div>
                  <span className="text-sm text-gray-800">Pro Account Access</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-white text-xs">⭐</span>
                  </div>
                  <span className="text-sm text-gray-800">Revise and adjust submissions if your first attempt wasn't qualified</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-white text-xs">⭐</span>
                  </div>
                  <span className="text-sm text-gray-800">Higher rates up to $14 per task</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-white text-xs">⭐</span>
                  </div>
                  <span className="text-sm text-gray-800">Elite insights newsletter on client demands</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-white text-xs">⭐</span>
                  </div>
                  <span className="text-sm text-gray-800">Faster approvals within 14 days</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-white text-xs">⭐</span>
                  </div>
                  <span className="text-sm text-gray-800">Withdraw earnings anytime 24/7</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-white text-xs">⭐</span>
                  </div>
                  <span className="text-sm text-gray-800">Lifetime access included</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}