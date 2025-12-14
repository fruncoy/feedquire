import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { AIPlatform } from '../types';
import { ChevronLeft, Plus, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';

export function AdminPlatformsPage() {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState<AIPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ domain: '', description: '', amount: '2.50' });
  const [submitting, setSubmitting] = useState(false);
  const [platformStats, setPlatformStats] = useState<Record<string, { approved: number; rejected: number; pending: number }>>({});
  const [editingPlatform, setEditingPlatform] = useState<AIPlatform | null>(null);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_platforms')
        .select('*')
        .order('is_assessment', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlatforms(data || []);
      
      // Fetch submission stats for each platform
      if (data) {
        const stats: Record<string, any> = {};
        for (const platform of data) {
          const { data: submissions } = await supabase
            .from('feedback_submissions')
            .select('status')
            .eq('platform_id', platform.id)
            .neq('status', 'in_progress');
          
          const approved = submissions?.filter(s => s.status === 'approved' || s.status === 'paid').length || 0;
          const rejected = submissions?.filter(s => s.status === 'rejected').length || 0;
          const pending = submissions?.filter(s => s.status === 'submitted').length || 0;
          
          stats[platform.id] = { approved, rejected, pending };
        }
        setPlatformStats(stats);
      }
    } catch (err) {
      console.error('Error fetching platforms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlatform = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingPlatform) {
        const { error } = await supabase
          .from('ai_platforms')
          .update({
            domain: formData.domain,
            description: formData.description,
            amount_per_submission: parseFloat(formData.amount),
          })
          .eq('id', editingPlatform.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('ai_platforms')
          .insert({
            domain: formData.domain,
            description: formData.description,
            amount_per_submission: parseFloat(formData.amount),
            status: 'active',
          });

        if (error) throw error;
      }

      setFormData({ domain: '', description: '', amount: '2.50' });
      setShowForm(false);
      setEditingPlatform(null);
      await fetchPlatforms();
    } catch (err) {
      console.error('Error saving platform:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPlatform = (platform: AIPlatform) => {
    setEditingPlatform(platform);
    setFormData({
      domain: platform.domain,
      description: platform.description || '',
      amount: platform.amount_per_submission.toString(),
    });
    setShowForm(true);
  };

  const handleDeletePlatform = async (id: string) => {
    if (!confirm('Are you sure you want to delete this platform?')) return;

    try {
      const { error } = await supabase
        .from('ai_platforms')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchPlatforms();
    } catch (err) {
      console.error('Error deleting platform:', err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-16"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingPlatform(null);
              setFormData({ domain: '', description: '', amount: '2.50' });
            }}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2"
          >
            <Plus size={18} />
            Add Platform
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAddPlatform} className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Domain</label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="www.example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this AI platform..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Amount per Submission ($)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  min="1.25"
                  max="4.99"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  {submitting ? (editingPlatform ? 'Updating...' : 'Adding...') : (editingPlatform ? 'Update Platform' : 'Add Platform')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPlatform(null);
                    setFormData({ domain: '', description: '', amount: '2.50' });
                  }}
                  className="flex-1 border border-gray-300 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {platforms.map((platform) => {
                  const stats = platformStats[platform.id] || { approved: 0, rejected: 0, pending: 0 };
                  return (
                    <tr key={platform.id} className={`hover:bg-gray-50 ${platform.is_assessment ? 'bg-blue-100' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          {platform.is_assessment && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">A</span>
                          )}
                          {platform.domain}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {platform.description || 'No description'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${platform.amount_per_submission.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          platform.status === 'active'
                            ? 'bg-green-50 text-green-700'
                            : platform.status === 'paused'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-gray-50 text-gray-700'
                        }`}>
                          {platform.status.charAt(0).toUpperCase() + platform.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex gap-2">
                          <span className="text-green-600">A: {stats.approved}</span>
                          <span className="text-red-600">R: {stats.rejected}</span>
                          <span className="text-orange-600">P: {stats.pending}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPlatform(platform)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePlatform(platform.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
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
