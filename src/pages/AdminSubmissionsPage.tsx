import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FeedbackSubmission, AIPlatform, SubmissionResponse, FeedbackQuestion } from '../types';
import { ChevronLeft, CheckCircle2, XCircle, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';

interface SubmissionWithDetails {
  submission: FeedbackSubmission;
  platform: AIPlatform;
  responses: SubmissionResponse[];
  questions: Record<string, FeedbackQuestion>;
  userName: string;
}

export function AdminSubmissionsPage() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<SubmissionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithDetails | null>(null);
  const [updating, setUpdating] = useState(false);
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [expandedPlatforms, setExpandedPlatforms] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      // Fetch all data in parallel
      const [
        submissionsResult,
        platformsResult,
        profilesResult,
        questionsResult
      ] = await Promise.all([
        supabase.from('feedback_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('ai_platforms').select('*'),
        supabase.from('profiles').select('user_id, full_name'),
        supabase.from('feedback_questions').select('*')
      ]);

      if (submissionsResult.error) throw submissionsResult.error;

      // Create lookup maps
      const platformsMap = new Map();
      platformsResult.data?.forEach(p => platformsMap.set(p.id, p));
      
      const profilesMap = new Map();
      profilesResult.data?.forEach(p => profilesMap.set(p.user_id, p.full_name));
      
      const questionsMap: Record<string, FeedbackQuestion> = {};
      questionsResult.data?.forEach(q => questionsMap[q.id] = q);

      // Build enriched submissions
      const enrichedSubmissions: SubmissionWithDetails[] = (submissionsResult.data || []).map(submission => ({
        submission,
        platform: platformsMap.get(submission.platform_id) || null,
        responses: [], // Skip responses for performance
        questions: questionsMap,
        userName: profilesMap.get(submission.user_id) || 'Unknown User',
      }));

      setSubmissions(enrichedSubmissions);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string) => {
    setUpdating(true);
    try {
      const sub = submissions.find(s => s.submission.id === submissionId);
      if (!sub) return;

      const { error } = await supabase
        .from('feedback_submissions')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          amount_earned: sub.platform.amount_per_submission,
        })
        .eq('id', submissionId);

      if (error) throw error;

      // If this is an assessment submission, promote user to Tier 3
      if (sub.platform.is_assessment) {
        await supabase
          .from('profiles')
          .update({
            account_status: '2hF2kQ7rD5xVfM1tZ',
          })
          .eq('user_id', sub.submission.user_id);
      }

      await fetchSubmissions();
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Error approving submission:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async (submissionId: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('feedback_submissions')
        .update({
          status: 'rejected',
          rejection_reason: null,
        })
        .eq('id', submissionId);

      if (error) throw error;
      await fetchSubmissions();
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Error rejecting submission:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkPaid = async (submissionId: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('feedback_submissions')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
        })
        .eq('id', submissionId);

      if (error) throw error;

      const sub = submissions.find(s => s.submission.id === submissionId);
      if (sub) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('total_earned')
          .eq('user_id', sub.submission.user_id)
          .maybeSingle();

        if (profile) {
          await supabase
            .from('profiles')
            .update({
              total_earned: (profile.total_earned || 0) + (sub.submission.amount_earned || 0),
            })
            .eq('user_id', sub.submission.user_id);
        }
      }

      await fetchSubmissions();
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Error marking paid:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedSubmissions.size === 0) return;
    setBulkUpdating(true);
    try {
      const submissionIds = Array.from(selectedSubmissions);
      const submissionsToUpdate = submissions.filter(s => submissionIds.includes(s.submission.id));
      
      for (const item of submissionsToUpdate) {
        await supabase
          .from('feedback_submissions')
          .update({
            status: 'approved',
            approved_at: new Date().toISOString(),
            amount_earned: item.platform?.amount_per_submission || 0,
          })
          .eq('id', item.submission.id);

        if (item.platform?.is_assessment) {
          await supabase
            .from('profiles')
            .update({ account_status: '2hF2kQ7rD5xVfM1tZ' })
            .eq('user_id', item.submission.user_id);
        }
      }

      setSelectedSubmissions(new Set());
      await fetchSubmissions();
    } catch (err) {
      console.error('Error bulk approving:', err);
    } finally {
      setBulkUpdating(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedSubmissions.size === 0) return;
    setBulkUpdating(true);
    try {
      const submissionIds = Array.from(selectedSubmissions);
      
      for (const id of submissionIds) {
        await supabase
          .from('feedback_submissions')
          .update({
            status: 'rejected',
            rejection_reason: null,
          })
          .eq('id', id);
      }

      setSelectedSubmissions(new Set());
      await fetchSubmissions();
    } catch (err) {
      console.error('Error bulk rejecting:', err);
    } finally {
      setBulkUpdating(false);
    }
  };

  const handleSelectAll = () => {
    const pendingSubmissions = submissions
      .filter(s => s.submission.status === 'submitted')
      .map(s => s.submission.id);
    setSelectedSubmissions(new Set(pendingSubmissions));
  };

  const handleDeselectAll = () => {
    setSelectedSubmissions(new Set());
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="w-full bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-48 mb-1"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-8"></div>
                    <div className="h-8 bg-gray-200 rounded w-8"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }



  const togglePlatform = (platformId: string) => {
    const newExpanded = new Set(expandedPlatforms);
    if (newExpanded.has(platformId)) {
      newExpanded.delete(platformId);
    } else {
      newExpanded.add(platformId);
    }
    setExpandedPlatforms(newExpanded);
  };

  // Group submissions by platform
  const platformGroups = submissions.reduce((groups, item) => {
    const platformId = item.platform?.id || 'unknown';
    const platformName = item.platform?.domain || 'Unknown Platform';
    
    if (!groups[platformId]) {
      groups[platformId] = {
        platform: item.platform,
        platformName,
        submissions: [],
        pending: 0,
        approved: 0,
        rejected: 0,
        paid: 0
      };
    }
    
    groups[platformId].submissions.push(item);
    
    // Count by status
    switch (item.submission.status) {
      case 'submitted':
        groups[platformId].pending++;
        break;
      case 'approved':
        groups[platformId].approved++;
        break;
      case 'rejected':
        groups[platformId].rejected++;
        break;
      case 'paid':
        groups[platformId].paid++;
        break;
    }
    
    return groups;
  }, {} as Record<string, any>);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="space-y-4">
          {Object.entries(platformGroups).map(([platformId, group]) => {
            const isExpanded = expandedPlatforms.has(platformId);
            const platformSubmissions = group.submissions.filter((s: any) => s.submission.status === 'submitted');
            const selectedInPlatform = platformSubmissions.filter((s: any) => selectedSubmissions.has(s.submission.id)).length;
            
            return (
              <div key={platformId} className="bg-white border border-gray-200 rounded-lg">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => togglePlatform(platformId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{group.platformName}</h3>
                      <div className="flex gap-2">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          {group.pending} pending
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {group.approved} approved
                        </span>
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          {group.rejected} rejected
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {group.paid} paid
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      {isExpanded ? '▼' : '▶'}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4">
                    {selectedInPlatform > 0 && (
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm text-gray-600">{selectedInPlatform} selected</span>
                        <button
                          onClick={handleBulkApprove}
                          disabled={bulkUpdating}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 transition"
                        >
                          {bulkUpdating ? 'Processing...' : 'Bulk Approve'}
                        </button>
                        <button
                          onClick={handleBulkReject}
                          disabled={bulkUpdating}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50 transition"
                        >
                          {bulkUpdating ? 'Processing...' : 'Bulk Reject'}
                        </button>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {group.submissions.map((item: any) => (
                        <div
                          key={item.submission.id}
                          className={`border rounded-lg p-3 ${
                            selectedSubmissions.has(item.submission.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {item.submission.status === 'submitted' && (
                                <input
                                  type="checkbox"
                                  checked={selectedSubmissions.has(item.submission.id)}
                                  onChange={(e) => {
                                    const newSelected = new Set(selectedSubmissions);
                                    if (e.target.checked) {
                                      newSelected.add(item.submission.id);
                                    } else {
                                      newSelected.delete(item.submission.id);
                                    }
                                    setSelectedSubmissions(newSelected);
                                  }}
                                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                              )}
                              <span className="font-medium text-gray-900">{item.userName}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.submission.status === 'submitted'
                                  ? 'bg-blue-50 text-blue-700'
                                  : item.submission.status === 'approved'
                                  ? 'bg-green-50 text-green-700'
                                  : item.submission.status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-50 text-red-700'
                              }`}>
                                {item.submission.status}
                              </span>
                              {item.submission.status === 'submitted' && (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleApprove(item.submission.id)}
                                    disabled={updating}
                                    className="p-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
                                    title="Approve"
                                  >
                                    <CheckCircle2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleReject(item.submission.id)}
                                    disabled={updating}
                                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition"
                                    title="Reject"
                                  >
                                    <XCircle size={14} />
                                  </button>
                                </div>
                              )}
                              {item.submission.status === 'approved' && (
                                <button
                                  onClick={() => handleMarkPaid(item.submission.id)}
                                  disabled={updating}
                                  className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
                                  title="Mark as Paid"
                                >
                                  <DollarSign size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
