
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Company, SoftwareLink } from '../types';
import { ChevronLeft, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';

export function AdminCompaniesPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companySoftware, setCompanySoftware] = useState<SoftwareLink[]>([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanySoftware = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('software_links')
        .select('*')
        .eq('company_id', companyId);

      if (error) throw error;
      setCompanySoftware(data || []);
    } catch (err) {
      console.error('Error fetching company software:', err);
    }
  };

  const handleApprove = async (companyId: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          account_status: 'verified',
        })
        .eq('id', companyId);

      if (error) throw error;
      await fetchCompanies();
      if (selectedCompany) {
        const { data: updatedCompany } = await supabase
          .from('companies')
          .select('*')
          .eq('id', selectedCompany.id)
          .single();
        if (updatedCompany) {
          setSelectedCompany(updatedCompany);
        }
      }
    } catch (err) {
      console.error('Error approving company:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async (companyId: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          account_status: 'rejected',
        })
        .eq('id', companyId);

      if (error) throw error;
      await fetchCompanies();
      setSelectedCompany(null);
    } catch (err) {
      console.error('Error rejecting company:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleApproveSoftware = async (softwareId: string) => {
    try {
      const { error } = await supabase
        .from('software_links')
        .update({ status: 'active' })
        .eq('id', softwareId);

      if (error) throw error;
      if (selectedCompany) {
        fetchCompanySoftware(selectedCompany.id);
      }
    } catch (err) {
      console.error('Error approving software:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      'pending': { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Pending' },
      'verified': { bg: 'bg-green-50', text: 'text-green-700', label: 'Verified' },
      'rejected': { bg: 'bg-red-50', text: 'text-red-700', label: 'Rejected' },
    };
    const badge = badges[status] || { bg: 'bg-gray-50', text: 'text-gray-700', label: status };
    return badge;
  };

  const getSoftwareStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      'pending': { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Pending' },
      'funded': { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Funded' },
      'active': { bg: 'bg-green-50', text: 'text-green-700', label: 'Active' },
      'completed': { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Completed' },
    };
    const badge = badges[status] || { bg: 'bg-gray-50', text: 'text-gray-700', label: status };
    return badge;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="space-y-8">
            <div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <tr key={idx} className="animate-pulse">
                          <td className="px-6 py-4">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                          <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-16"></div></td>
                          <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-8"></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (selectedCompany) {
    const badge = getStatusBadge(selectedCompany.account_status);
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => {
                setSelectedCompany(null);
                setCompanySoftware([]);
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            >
              <ChevronLeft size={18} />
              Back to Companies
            </button>

            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{selectedCompany.company_name}</h2>
                  <p className="text-gray-600">{selectedCompany.company_email}</p>
                  {selectedCompany.company_website && <p className="text-gray-600">{selectedCompany.company_website}</p>}
                </div>
                <div className={`${badge.bg} ${badge.text} px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-medium`}>
                  {badge.label}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8 py-6 border-t border-b border-gray-300">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Verification Status</p>
                  <p className="text-gray-900">{selectedCompany.verification_status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Payment Status</p>
                  <p className="text-gray-900">{selectedCompany.payment_status}</p>
                </div>
              </div>

              {selectedCompany.verification_status === 'verified' && selectedCompany.account_status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(selectedCompany.id)}
                    disabled={updating}
                    className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    {updating ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(selectedCompany.id)}
                    disabled={updating}
                    className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition"
                  >
                    {updating ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Software Links</h3>
              {companySoftware.length === 0 ? (
                <p className="text-gray-600">No software links yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {companySoftware.map((software) => {
                    const badge = getSoftwareStatusBadge(software.status);
                    return (
                      <div key={software.id} className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{software.name}</h4>
                          <div className={`${badge.bg} ${badge.text} px-2 py-1 rounded-full text-xs font-medium`}>
                            {badge.label}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{software.description}</p>
                        <p className="text-sm text-gray-500 mb-2">{software.website}</p>
                        <div className="space-y-1 mb-2">
                          <p className="text-sm text-gray-600">Total Budget: <span className="font-medium">${software.total_budget.toFixed(2)}</span></p>
                          <p className="text-sm text-gray-600">Max Responses: <span className="font-medium">{software.max_responses}</span></p>
                          <p className="text-sm text-gray-600">Per Submission: <span className="font-medium">${software.amount_per_submission.toFixed(2)}</span></p>
                          {software.deadline && <p className="text-sm text-gray-600">Deadline: <span className="font-medium">{new Date(software.deadline).toLocaleDateString()}</span></p>}
                          {software.optional_clarifications && <p className="text-sm text-gray-500 italic">Clarifications: {software.optional_clarifications}</p>}
                        </div>
                        {software.status === 'funded' && (
                          <button
                            onClick={() => handleApproveSoftware(software.id)}
                            className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                          >
                            Approve Software
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Companies ({companies.length})</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companies.map((company) => {
                  const badge = getStatusBadge(company.account_status);
                  return (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {company.company_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {company.company_email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(company.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`${badge.bg} ${badge.text} px-2 py-1 rounded-full text-xs font-medium`}>
                          {badge.label}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => {
                            setSelectedCompany(company);
                            fetchCompanySoftware(company.id);
                          }}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          title="View Company"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
