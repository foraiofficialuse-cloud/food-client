import { useEffect, useState } from 'react';
import { getAllOrdersAPI, deleteOrderAPI, cancelOrderAPI } from '@/lib/api';
import { type FoodRequest } from '@/types';
import StatusBadge from '@/components/shared/StatusBadge';
import { Trash2, XCircle, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminAllOrders() {
  const [orders, setOrders] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchOrders = () =>
      getAllOrdersAPI()
        .then((res) => setOrders(res.data.orders))
        .finally(() => setLoading(false));

    fetchOrders();
    const intervalId = window.setInterval(fetchOrders, 15000);
    return () => window.clearInterval(intervalId);
  }, []);

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this order permanently?')) return;
    await deleteOrderAPI(id);
    setOrders((prev) => prev.filter((o) => o._id !== id));
    showMsg('Order deleted.');
  };

  const handleCancel = async (id: string) => {
    const res = await cancelOrderAPI(id);
    setOrders((prev) => prev.map((o) => (o._id === id ? res.data.order : o)));
    showMsg('Order cancelled.');
  };

  const filtered = orders.filter(
    (o) =>
      o.ngoName.toLowerCase().includes(search.toLowerCase()) ||
      o.hotelName.toLowerCase().includes(search.toLowerCase()) ||
      o.status.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">All Orders</h1>
        <p className="text-gray-500 mt-1">{orders.length} total food requests</p>
      </div>

      {msg && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200 text-sm">✓ {msg}</div>}

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-orange-50 border-b border-orange-100">
              {['Hotel', 'NGO', 'Status', 'People Served', 'Date', 'Actions'].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4 font-medium text-gray-800 text-sm">{order.hotelName}</td>
                <td className="px-5 py-4 text-gray-600 text-sm">{order.ngoName}</td>
                <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                <td className="px-5 py-4 text-gray-600 text-sm">{order.peopleServed || '—'}</td>
                <td className="px-5 py-4 text-gray-400 text-xs">{format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}</td>
                <td className="px-5 py-4 flex gap-2">
                  {!['cancelled', 'served'].includes(order.status) && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="p-1.5 text-orange-400 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all"
                      title="Cancel"
                    >
                      <XCircle size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No orders found.</div>}
      </div>
    </div>
  );
}