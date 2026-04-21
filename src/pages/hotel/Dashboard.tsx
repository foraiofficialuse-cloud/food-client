import { useEffect, useState } from 'react';
import { hotelStatsAPI } from '@/lib/api';
import StatCard from '@/components/shared/StatCard';
import { Utensils, CheckCircle, Clock, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { type DashboardStats, type MonthlyData } from '@/types';
import { useAuthStore } from '@/store/authStore';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function HotelDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthly, setMonthly] = useState<{ name: string; servings: number }[]>([]);
  const { user } = useAuthStore();

  useEffect(() => {
    hotelStatsAPI().then((res) => {
      setStats(res.data.stats);
      const md: MonthlyData[] = res.data.monthlyData;
      const byMonth = new Map<number, number>();
      md.forEach((entry) => {
        byMonth.set(
          entry._id.month,
          (byMonth.get(entry._id.month) || 0) + (entry.servings || 0),
        );
      });
      setMonthly(
        MONTHS.map((name, index) => ({
          name,
          servings: byMonth.get(index + 1) || 0,
        })),
      );
    });
  }, []);

  if (!user?.isVerified) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center bg-amber-50 border border-amber-200 rounded-2xl p-10 max-w-md">
          <Clock size={48} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Awaiting Verification
          </h2>
          <p className="text-gray-500 text-sm">
            Your account is under review by the admin. You will be able to post food listings once verified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">Welcome, {user?.name}!</h1>
        <p className="text-gray-500 mt-1">Your food donation impact at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Listings" value={stats?.totalListings || 0} icon={Utensils} color="orange" />
        <StatCard title="Active Now" value={stats?.activeListings || 0} icon={Clock} color="blue" subtitle="Available listings" />
        <StatCard title="Donations Made" value={stats?.totalDonations || 0} icon={CheckCircle} color="green" />
        <StatCard title="Servings Donated" value={stats?.totalServings?.toLocaleString() || 0} icon={Users} color="purple" />
      </div>

      {monthly.length > 0 && (
        <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Monthly Servings Donated</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '12px' }} />
              <Bar dataKey="servings" name="Servings" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}