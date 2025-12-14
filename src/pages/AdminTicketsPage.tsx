import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Ticket } from '../types';
import { MessageSquare, Clock, CheckCircle2, Send } from 'lucide-react';

export function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      const ticketsWithProfiles = await Promise.all(
        (ticketsData || []).map(async (ticket) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', ticket.user_id)
            .single();
          
          return {
            ...ticket,
            profiles: { full_name: profile?.full_name || 'Unknown User' }
          };
        })
      );

      setTickets(ticketsWithProfiles);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (ticketId: string) => {
    if (!reply.trim()) return;

    setUpdating(true);
    try {
      await supabase
        .from('tickets')
        .update({
          admin_reply: reply.trim(),
          status: 'resolved',
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId);

      setReply('');
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      console.error('Error updating ticket:', err);
    } finally {
      setUpdating(false);
    }
  };

  const markResolved = async (ticketId: string) => {
    setUpdating(true);
    try {
      await supabase
        .from('tickets')
        .update({
          status: 'resolved',
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId);

      fetchTickets();
    } catch (err) {
      console.error('Error updating ticket:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                  <div className="ml-4">
                    <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No tickets found</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                      {ticket.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          <Clock size={10} />
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          <CheckCircle2 size={10} />
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      By {ticket.profiles.full_name} • {new Date(ticket.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 text-sm">{ticket.description}</p>
                    {ticket.admin_reply && (
                      <div className="bg-gray-50 border border-gray-200 rounded p-2 mt-2">
                        <p className="text-xs font-medium text-gray-900 mb-1">Reply:</p>
                        <p className="text-gray-700 text-sm">{ticket.admin_reply}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    {ticket.status === 'pending' && (
                      selectedTicket === ticket.id ? (
                        <div className="flex flex-col gap-2 w-32">
                          <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Reply..."
                            rows={2}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 resize-none"
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleReply(ticket.id)}
                              disabled={!reply.trim() || updating}
                              className="px-2 py-1 bg-gray-900 text-white rounded text-xs hover:bg-gray-800 disabled:opacity-50 flex items-center gap-1"
                            >
                              <Send size={12} />
                            </button>
                            <button
                              onClick={() => setSelectedTicket(null)}
                              className="px-2 py-1 text-gray-600 border border-gray-300 rounded text-xs hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setSelectedTicket(ticket.id)}
                            className="px-3 py-1 bg-gray-900 text-white rounded text-sm hover:bg-gray-800"
                          >
                            Reply
                          </button>
                          <button
                            onClick={() => markResolved(ticket.id)}
                            disabled={updating}
                            className="px-3 py-1 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
                          >
                            Resolve
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}