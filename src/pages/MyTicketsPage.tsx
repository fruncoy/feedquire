import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { Ticket } from '../types';
import { MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

export function MyTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

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
        <div className="px-6 py-6 h-20 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold text-gray-900">My Tickets</h1>
          <p className="text-gray-600 text-sm mt-1">View your support requests and replies</p>
        </div>
      </div>

      <div className="p-6">
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