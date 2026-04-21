import { useEffect, useState } from "react";
import { adminDashboardAPI } from "@/lib/api";
import StatCard from "@/components/shared/StatCard";
import {
  Users,
  Building2,
  Heart,
  ClipboardList,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { type DashboardStats, type MonthlyData } from "@/types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthly, setMonthly] = useState<
    { name: string; donations: number; servings: number; people: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = () =>
      adminDashboardAPI()
        .then((res) => {
          setStats(res.data.stats);
          const md: MonthlyData[] = res.data.monthlyData;
          const byMonth = new Map<number, { donations: number; people: number }>();
          md.forEach((entry) => {
            byMonth.set(entry._id.month, {
              donations:
                (byMonth.get(entry._id.month)?.donations || 0) + (entry.count || 0),
              people: (byMonth.get(entry._id.month)?.people || 0) + (entry.people || 0),
            });
          });
          setMonthly(
            MONTHS.map((name, index) => ({
              name,
              donations: byMonth.get(index + 1)?.donations || 0,
              servings: 0,
              people: byMonth.get(index + 1)?.people || 0,
            })),
          );
        })
        .finally(() => setLoading(false));

    fetchDashboard();
    const intervalId = window.setInterval(fetchDashboard, 30000);
    return () => window.clearInterval(intervalId);
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading...
      </div>
    );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform-wide overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Hotels"
          value={stats?.totalHotels || 0}
          icon={Building2}
          color="orange"
        />
        <StatCard
          title="Total NGOs"
          value={stats?.totalNGOs || 0}
          icon={Heart}
          color="green"
        />
        <StatCard
          title="Pending Verification"
          value={stats?.pendingVerifications || 0}
          icon={UserCheck}
          color="purple"
          subtitle="Awaiting admin review"
        />
        <StatCard
          title="Total Listings"
          value={stats?.totalListings || 0}
          icon={ClipboardList}
          color="blue"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalRequests || 0}
          icon={Users}
          color="orange"
        />
        <StatCard
          title="People Served"
          value={stats?.totalPeopleServed?.toLocaleString() || 0}
          icon={TrendingUp}
          color="green"
          subtitle="Lives impacted"
        />
      </div>

      {monthly.length > 0 && (
        <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            Monthly Impact
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={monthly}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #fed7aa",
                }}
              />
              <Legend />
              <Bar
                dataKey="donations"
                name="Donations"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="people"
                name="People Served"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
