import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Ticket } from '../types';
import { Send, MessageSquare, Clock, CheckCircle2, Plus } from 'lucide-react';
import { MetaPixelEvents } from '../lib/metaPixel';

export function SubmitTicketPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchTickets();
  }, [user]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !description.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      await supabase
        .from('tickets')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
        });

      MetaPixelEvents.contact('Support Ticket');
      MetaPixelEvents.lead('Support Ticket Submission');
      
      setTitle('');
      setDescription('');
      setShowForm(false);
      fetchTickets();
    } catch (err: any) {
      setError('Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center">Loading tickets...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white border-b border-gray-200 rounded-br-lg">
        <div className="px-6 py-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Submit Ticket</h1>
            <p className="text-gray-600 text-sm mt-1">View your tickets and submit new ones</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition flex items-center gap-2"
          >
            <Plus size={18} />
            New Ticket
          </button>
        </div>
      </div>

      <div className="p-6">
        {showForm && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit New Ticket</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief description of the issue"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed description of the issue or question"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!title.trim() || !description.trim() || submitting}
                    className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                  >
                    {submitting ? 'Submitting...' : 'Submit'} <Send size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-gray-600 border border-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No tickets submitted yet</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                    <p className="text-sm text-gray-600">
                      Submitted {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {ticket.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        <Clock size={12} />
                        Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        <CheckCircle2 size={12} />
                        Resolved
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Your Message:</p>
                  <p className="text-gray-700">{ticket.description}</p>
                </div>

                {ticket.admin_reply && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Admin Reply:</p>
                    <p className="text-gray-700">{ticket.admin_reply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}