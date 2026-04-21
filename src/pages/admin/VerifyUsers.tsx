import { useEffect, useState } from 'react';
import { getPendingUsersAPI, verifyUserAPI, getUploadFileUrl } from '@/lib/api';
import { type User } from '@/types';
import { CheckCircle, XCircle, FileText, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminVerifyUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchUsers = () => {
    getPendingUsersAPI().then((res) => setUsers(res.data.users)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAction = async (userId: string, action: 'approve' | 'reject') => {
    setActionLoading(userId + action);
    try {
      await verifyUserAPI(userId, { action, rejectionReason: rejectReason[userId] });
      setMessage(`User ${action}d successfully!`);
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Verify Users</h1>
        <p className="text-gray-500 mt-1">{users.length} pending verification request{users.length !== 1 ? 's' : ''}</p>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200 text-sm">
          ✓ {message}
        </div>
      )}

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <CheckCircle size={48} className="text-green-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">All caught up! No pending verifications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user._id} className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${user.role === 'hotel' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                    <span className="text-lg">{user.role === 'hotel' ? '🏨' : '🤝'}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{user.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      user.role === 'hotel' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role === 'hotel' ? 'Hotel/Restaurant' : 'NGO'}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={12} />
                  {format(new Date(user.createdAt), 'dd MMM yyyy')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} className="text-gray-400" /> {user.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} className="text-gray-400" /> {user.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600 col-span-2">
                  <MapPin size={14} className="text-gray-400" /> {user.address}, {user.city} - {user.pincode}
                </div>
              </div>

              {user.registrationDoc && (
                <a
                  href={getUploadFileUrl(user.registrationDoc)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 text-sm hover:underline mb-4"
                >
                  <FileText size={14} /> View Registration Document
                </a>
              )}

              <div className="border-t border-gray-100 pt-4 flex items-center gap-3">
                <textarea
                  placeholder="Rejection reason (required if rejecting)"
                  value={rejectReason[user._id] || ''}
                  onChange={(e) => setRejectReason({ ...rejectReason, [user._id]: e.target.value })}
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAction(user._id, 'approve')}
                    disabled={actionLoading === user._id + 'approve'}
                    className="flex items-center gap-1.5 px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-all disabled:opacity-60"
                  >
                    <CheckCircle size={15} /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(user._id, 'reject')}
                    disabled={actionLoading === user._id + 'reject'}
                    className="flex items-center gap-1.5 px-5 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all disabled:opacity-60"
                  >
                    <XCircle size={15} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}