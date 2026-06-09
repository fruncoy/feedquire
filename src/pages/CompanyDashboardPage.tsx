
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Company, SoftwareLink, CompanyPayment } from '../types';
import { Plus, CheckCircle, Clock, XCircle, CreditCard, Home, Package, FileText, User, Save } from 'lucide-react';
import PaystackPop from '@paystack/inline-js';

type Section = 'dashboard' | 'software' | 'results' | 'payments' | 'profile';

export function CompanyDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshCompany } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [softwareLinks, setSoftwareLinks] = useState<SoftwareLink[]>([]);
  const [companyPayments, setCompanyPayments] = useState<CompanyPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSoftware, setShowAddSoftware] = useState(false);
  const [showFundModal, setShowFundModal] = useState<SoftwareLink | null>(null);
  const [newSoftware, setNewSoftware] = useState({ name: '', description: '', website: '', totalBudget: 18200, maxResponses: 10, optionalClarifications: '', deadline: '' });
  const [editProfile, setEditProfile] = useState({ companyName: '', companyEmail: '', companyWebsite: '' });

  // Determine active section from URL
  const getActiveSection = (): Section => {
    if (location.pathname.includes('/software')) return 'software';
    if (location.pathname.includes('/results')) return 'results';
    if (location.pathname.includes('/payments')) return 'payments';
    if (location.pathname.includes('/profile')) return 'profile';
    return 'dashboard';
  };

  const activeSection = getActiveSection();

  useEffect(() => {
    if (user) {
      fetchCompanyData();
    }
  }, [user]);

  useEffect(() => {
    if (company) {
      setEditProfile({
        companyName: company.company_name,
        companyEmail: company.company_email,
        companyWebsite: company.company_website || '',
      });
    }
  }, [company]);

  const fetchCompanyData = async () => {
    try {
      if (!user) return;

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (companyError) throw companyError;
      setCompany(companyData);

      if (companyData) {
        const [softwareResult, paymentsResult] = await Promise.all([
          supabase.from('software_links').select('*').eq('company_id', companyData.id),
          supabase.from('company_payments').select('*').eq('company_id', companyData.id).order('created_at', { ascending: false }),
        ]);
        
        if (softwareResult.error) throw softwareResult.error;
        if (paymentsResult.error) throw paymentsResult.error;
        
        setSoftwareLinks(softwareResult.data || []);
        setCompanyPayments(paymentsResult.data || []);
      }
    } catch (err) {
      console.error('Error fetching company data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!company) return;
      const { error } = await supabase
        .from('companies')
        .update({
          company_name: editProfile.companyName,
          company_email: editProfile.companyEmail,
          company_website: editProfile.companyWebsite || null,
        })
        .eq('id', company.id);
      if (error) throw error;
      await fetchCompanyData();
      await refreshCompany();
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const handleAddSoftware = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    try {
      const amountPerSubmission = newSoftware.totalBudget / newSoftware.maxResponses;
      
      const { error } = await supabase
        .from('software_links')
        .insert({
          company_id: company.id,
          name: newSoftware.name,
          description: newSoftware.description,
          website: newSoftware.website,
          total_budget: newSoftware.totalBudget,
          max_responses: newSoftware.maxResponses,
          amount_per_submission: amountPerSubmission,
          optional_clarifications: newSoftware.optionalClarifications,
          deadline: newSoftware.deadline ? new Date(newSoftware.deadline).toISOString() : null,
        });

      if (error) throw error;
      setShowAddSoftware(false);
      setNewSoftware({ name: '', description: '', website: '', totalBudget: 18200, maxResponses: 10, optionalClarifications: '', deadline: '' });
      fetchCompanyData();
    } catch (err: any) {
      console.error('Error adding software:', err);
    }
  };

  const handleFundSoftware = async (software: SoftwareLink) => {
    setShowFundModal(software);
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email: company?.company_email || '',
      amount: software.total_budget * 100, // convert to cents (KES)
      currency: 'KES',
      ref: `fund_${software.id}_${Date.now()}`,
      metadata: {
        company_id: company?.id,
        software_id: software.id,
        purpose: 'job_funding'
      },
      onSuccess: async (transaction: any) => {
        console.log('Job funding successful:', transaction);
        handlePaymentSuccess(software.id, transaction.reference);
      },
      onCancel: () => {
        console.log('Funding cancelled');
        setShowFundModal(null);
      },
      onError: (error: any) => {
        console.error('Funding error:', error);
        setShowFundModal(null);
      }
    });
  };

  const handlePaymentSuccess = async (softwareId: string, reference: string) => {
    try {
      // Update software link status
      const { error: softwareError } = await supabase
        .from('software_links')
        .update({
          status: 'funded'
        })
        .eq('id', softwareId);

      if (softwareError) throw softwareError;

      // Record payment
      const { error: paymentError } = await supabase
        .from('company_payments')
        .insert({
          company_id: company?.id,
          amount: (await supabase.from('software_links').select('total_budget').eq('id', softwareId).single()).data?.total_budget,
          payment_reference: reference,
          status: 'success',
          type: 'job'
        });

      if (paymentError) console.warn('Payment record failed:', paymentError);
      
      setShowFundModal(null);
      fetchCompanyData();
    } catch (err) {
      console.error('Error updating software after payment:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      'pending': { bg: 'bg-yellow-50', text: 'text-yellow-800', label: 'Pending Funding' },
      'funded': { bg: 'bg-blue-50', text: 'text-blue-800', label: 'Funded' },
      'active': { bg: 'bg-green-50', text: 'text-green-800', label: 'Active' },
      'completed': { bg: 'bg-gray-50', text: 'text-gray-800', label: 'Completed' },
    };
    return badges[status] || { bg: 'bg-gray-50', text: 'text-gray-800', label: status };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Dashboard section component
  const renderDashboard = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Company Dashboard</h1>
        <p className="text-gray-600">Manage your software and get human feedback</p>
      </div>

      {company && (
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  {company.verification_status === 'verified' ? (
                    <CheckCircle size={20} className="text-green-600" />
                  ) : company.verification_status === 'pending' ? (
                    <Clock size={20} className="text-yellow-600" />
                  ) : (
                    <XCircle size={20} className="text-red-600" />
                  )}
                  <span className="font-medium capitalize">{company.verification_status}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Company Name</p>
                <p className="font-medium">{company.company_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium">{company.company_email}</p>
              </div>
            </div>

            {company.verification_status !== 'verified' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Verify your company with a KSh 1300 payment to start adding software links.
                </p>
                <button
                  onClick={() => navigate('/company/verify-payment')}
                  className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition"
                >
                  Verify Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick stats */}
      {company?.verification_status === 'verified' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Total Software</p>
            <p className="text-2xl font-semibold text-gray-900">{softwareLinks.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Active Jobs</p>
            <p className="text-2xl font-semibold text-gray-900">
              {softwareLinks.filter(s => ['funded', 'active'].includes(s.status)).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-1">Total Spent</p>
            <p className="text-2xl font-semibold text-gray-900">
              KSh {companyPayments
                .filter(p => p.status === 'success')
                .reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Software section component
  const renderSoftware = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Software Links</h1>
        <p className="text-gray-600">Manage your software and add new links for feedback</p>
      </div>

      {company?.verification_status === 'verified' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Software</h2>
            <button
              onClick={() => setShowAddSoftware(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2"
            >
              <Plus size={18} />
              Add Software
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {softwareLinks.map((software) => {
              const badge = getStatusBadge(software.status);
              return (
                <div key={software.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{software.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{software.description}</p>
                  <p className="text-sm text-gray-500 mb-2">{software.website}</p>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Budget:</span>
                      <span className="text-lg font-semibold text-gray-900">KSh {software.total_budget.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Max Responses:</span>
                      <span className="text-sm font-medium text-gray-900">{software.max_responses}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Per Submission:</span>
                      <span className="text-sm font-medium text-gray-900">KSh {software.amount_per_submission.toFixed(2)}</span>
                    </div>
                    {software.deadline && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Deadline:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(software.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`${badge.bg} ${badge.text} px-2 py-1 rounded-full text-xs font-medium`}>
                      {badge.label}
                    </div>
                    {software.status === 'pending' && (
                      <button
                        onClick={() => handleFundSoftware(software)}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                      >
                        <CreditCard size={14} />
                        Fund
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {softwareLinks.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No software links yet. Add your first one!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Results section component
  const renderResults = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Results</h1>
        <p className="text-gray-600">View feedback responses from users</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-600">Results section coming soon! Feedback will appear here once users start submitting.</p>
      </div>
    </div>
  );

  // Payments section component
  const renderPayments = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Payments</h1>
        <p className="text-gray-600">View your payment history</p>
      </div>
      
      {companyPayments.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No payments yet. Verify your company or add software to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companyPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.created_at ? new Date(payment.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.type || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      KSh {Number(payment.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.payment_reference || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // Profile section component
  const renderProfile = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your company profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Company Name</label>
              <input
                type="text"
                value={editProfile.companyName}
                onChange={(e) => setEditProfile({ ...editProfile, companyName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input
                type="email"
                value={editProfile.companyEmail}
                onChange={(e) => setEditProfile({ ...editProfile, companyEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Website</label>
              <input
                type="url"
                value={editProfile.companyWebsite}
                onChange={(e) => setEditProfile({ ...editProfile, companyWebsite: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div>
              <button
                onClick={handleSaveProfile}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Verification Status</span>
                <div className="flex items-center gap-2">
                  {company?.verification_status === 'verified' ? (
                    <>
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="font-medium text-green-700">Verified</span>
                    </>
                  ) : (
                    <>
                      <Clock size={18} className="text-yellow-600" />
                      <span className="font-medium text-yellow-700">Pending</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Status</span>
                <div className="flex items-center gap-2">
                  {company?.payment_status === 'verified' ? (
                    <>
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="font-medium text-green-700">Verified</span>
                    </>
                  ) : (
                    <>
                      <Clock size={18} className="text-yellow-600" />
                      <span className="font-medium text-yellow-700">Unverified</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'software' && renderSoftware()}
        {activeSection === 'results' && renderResults()}
        {activeSection === 'payments' && renderPayments()}
        {activeSection === 'profile' && renderProfile()}

        {showAddSoftware && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Add New Software</h2>
              <form onSubmit={handleAddSoftware} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Name</label>
                  <input
                    type="text"
                    value={newSoftware.name}
                    onChange={(e) => setNewSoftware({ ...newSoftware, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                  <textarea
                    value={newSoftware.description}
                    onChange={(e) => setNewSoftware({ ...newSoftware, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Website</label>
                  <input
                    type="url"
                    value={newSoftware.website}
                    onChange={(e) => setNewSoftware({ ...newSoftware, website: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Total Budget (KSh) <span className="text-gray-500">(Minimum KSh 18200)</span></label>
                  <input
                    type="number"
                    step="0.01"
                    min="18200"
                    value={newSoftware.totalBudget}
                    onChange={(e) => {
                      const budget = Number(e.target.value);
                      setNewSoftware({ 
                        ...newSoftware, 
                        totalBudget: budget 
                      });
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Max Responses <span className="text-gray-500">(Maximum 10)</span></label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSoftware.maxResponses}
                    onChange={(e) => setNewSoftware({ 
                      ...newSoftware, 
                      maxResponses: Math.min(10, Number(e.target.value)) 
                    })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Calculated amount per submission: <span className="font-semibold">
                      KSh {(newSoftware.totalBudget / newSoftware.maxResponses).toFixed(2)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Optional Clarifications</label>
                  <textarea
                    value={newSoftware.optionalClarifications}
                    onChange={(e) => setNewSoftware({ ...newSoftware, optionalClarifications: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Deadline (Optional)</label>
                  <input
                    type="datetime-local"
                    value={newSoftware.deadline}
                    onChange={(e) => setNewSoftware({ ...newSoftware, deadline: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddSoftware(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
