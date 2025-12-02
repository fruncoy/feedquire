import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Trash2, AlertTriangle, Users, Clock } from 'lucide-react';

interface AccountToDelete {
  user_id: string;
  full_name: string;
  created_at: string;
  age: string;
}

export function AdminCleanupPage() {
  const [loading, setLoading] = useState(false);
  const [fetchingAccounts, setFetchingAccounts] = useState(true);
  const [accountsToDelete, setAccountsToDelete] = useState<AccountToDelete[]>([]);
  const [result, setResult] = useState<{ count: number; message: string } | null>(null);

  useEffect(() => {
    fetchAccountsToDelete();
  }, []);

  const fetchAccountsToDelete = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, created_at')
        .eq('account_status', 'a7F9xQ2mP6kM4rT5')
        .lt('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString());
      
      if (error) throw error;

      const accountsWithAge = data?.map(account => ({
        ...account,
        age: getTimeAgo(account.created_at)
      })) || [];

      setAccountsToDelete(accountsWithAge);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    } finally {
      setFetchingAccounts(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
  };

  const handleCleanup = async () => {
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.rpc('cleanup_tier1_accounts');
      
      if (error) throw error;

      setResult({
        count: data || 0,
        message: `Successfully deleted ${data || 0} tier 1 accounts older than 48 hours`
      });
      
      // Refresh the list
      await fetchAccountsToDelete();
    } catch (err: any) {
      setResult({
        count: 0,
        message: `Error: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Cleanup</h1>
              <p className="text-gray-600">Delete tier 1 accounts older than 48 hours</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">Warning</h3>
                  <p className="text-sm text-yellow-700">
                    This will permanently delete all tier 1 accounts that were created more than 48 hours ago 
                    and haven't completed payment verification. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Accounts to be deleted */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">Accounts to be deleted ({accountsToDelete.length})</h3>
              </div>
              
              {fetchingAccounts ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading accounts...</p>
                </div>
              ) : accountsToDelete.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <div className="space-y-2">
                    {accountsToDelete.map((account) => (
                      <div key={account.user_id} className="flex items-center justify-between py-2 px-3 bg-white rounded border">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{account.full_name || 'No name'}</p>
                          <p className="text-xs text-gray-500">{account.user_id}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3" />
                          {account.age}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-700">No accounts found that need to be deleted</p>
                </div>
              )}
            </div>

            <button
              onClick={handleCleanup}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Tier 1 Accounts
                </>
              )}
            </button>

            {result && (
              <div className={`mt-6 p-4 rounded-lg ${
                result.count > 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
              }`}>
                <p className={`text-sm font-medium ${
                  result.count > 0 ? 'text-green-800' : 'text-gray-800'
                }`}>
                  {result.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}