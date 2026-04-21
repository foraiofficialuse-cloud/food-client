import { useEffect, useState } from 'react';
import { getAllUsersAPI, deleteUserAPI } from '@/lib/api';
import { type User } from '@/types';
import StatusBadge from '@/components/shared/StatusBadge';
import { Trash2, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchUsers = (role = '') => {
    getAllUsersAPI(role ? { role } : {}).then((res) => setUsers(res.data.users)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(roleFilter); }, [roleFilter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this user permanently?')) return;
    await deleteUserAPI(id);
    setDeleteId(id);
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">All Users</h1>
        <p className="text-gray-500 mt-1">{users.length} registered users</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, city..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white appearance-none"
          >
            <option value="">All Roles</option>
            <option value="hotel">Hotel</option>
            <option value="ngo">NGO</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-orange-50 border-b border-orange-100">
              {['Name', 'Email', 'Role', 'City', 'Status', 'Joined', 'Action'].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((user) => (
              <tr key={user._id} className={`hover:bg-gray-50 transition-colors ${deleteId === user._id ? 'opacity-50' : ''}`}>
                <td className="px-5 py-4 font-medium text-gray-800 text-sm">{user.name}</td>
                <td className="px-5 py-4 text-gray-500 text-sm">{user.email}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    user.role === 'hotel' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {user.role === 'hotel' ? '🏨 Hotel' : '🤝 NGO'}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-500 text-sm">{user.city}</td>
                <td className="px-5 py-4"><StatusBadge status={user.verificationStatus} /></td>
                <td className="px-5 py-4 text-gray-400 text-xs">{format(new Date(user.createdAt), 'dd MMM yyyy')}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                    title="Delete user"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No users found.</div>
        )}
      </div>
    </div>
  );
}