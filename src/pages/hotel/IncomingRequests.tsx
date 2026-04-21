import { useEffect, useState } from 'react';
import { getIncomingRequestsAPI, respondToRequestAPI } from '@/lib/api';
import { type FoodRequest } from '@/types';
import StatusBadge from '@/components/shared/StatusBadge';
import { Phone, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function HotelIncomingRequests() {
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchRequests = () =>
      getIncomingRequestsAPI()
        .then((res) => setRequests(res.data.requests))
        .finally(() => setLoading(false));

    fetchRequests();
    const intervalId = window.setInterval(fetchRequests, 15000);
    return () => window.clearInterval(intervalId);
  }, []);

  const handleAction = async (id: string, action: 'accept' | 'reject') => {
    await respondToRequestAPI(id, { action, hotelNotes: notes[id] });
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: action === 'accept' ? 'accepted' : 'rejected' } : r))
    );
    setMsg(`Request ${action}ed!`);
    setTimeout(() => setMsg(''), 3000);
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  const pending = requests.filter((r) => r.status === 'pending');
  const others = requests.filter((r) => r.status !== 'pending');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">NGO Requests</h1>
        <p className="text-gray-500 mt-1">{pending.length} pending, {others.length} past requests</p>
      </div>

      {msg && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200 text-sm">✓ {msg}</div>}

      {pending.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700">⏳ Pending Requests</h2>
          {pending.map((req) => (
            <div key={req._id} className="bg-white rounded-2xl border-2 border-orange-200 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{req.ngoName}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <a href={`tel:${req.ngoPhone}`} className="flex items-center gap-1 text-sm text-blue-500 hover:underline">
                      <Phone size={13} /> {req.ngoPhone}
                    </a>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{format(new Date(req.createdAt), 'dd MMM, HH:mm')}</span>
              </div>

              {req.ngoNotes && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
                  <p className="text-xs text-amber-700 flex items-start gap-2">
                    <MessageSquare size={13} className="mt-0.5 shrink-0" />
                    {req.ngoNotes}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <textarea
                  placeholder="Add a note for NGO (optional)"
                  value={notes[req._id] || ''}
                  onChange={(e) => setNotes({ ...notes, [req._id]: e.target.value })}
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAction(req._id, 'accept')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-all"
                  >
                    <CheckCircle size={14} /> Accept
                  </button>
                  <button
                    onClick={() => handleAction(req._id, 'reject')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {others.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">📋 Past Requests</h2>
          {others.map((req) => (
            <div key={req._id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-medium text-gray-800 text-sm">{req.ngoName}</p>
                <p className="text-xs text-gray-400">{format(new Date(req.createdAt), 'dd MMM yyyy')}</p>
              </div>
              <StatusBadge status={req.status} />
            </div>
          ))}
        </div>
      )}

      {requests.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <p className="text-gray-400">No requests yet. Post food listings to receive NGO requests.</p>
        </div>
      )}
    </div>
  );
}
