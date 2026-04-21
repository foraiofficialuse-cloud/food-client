import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, CheckCircle, Heart, Shield, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPublicStatsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface PublicStats {
  totalHotels: number;
  totalNGOs: number;
  totalPeopleServed: number;
}

export default function Landing() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<PublicStats>({
    totalHotels: 0,
    totalNGOs: 0,
    totalPeopleServed: 0,
  });

  useEffect(() => {
    getPublicStatsAPI()
      .then((res) => setStats(res.data.stats))
      .catch(() => undefined);
  }, []);

  const dashboardPath = user ? `/${user.role}/dashboard` : null;

  return (
    <div className="min-h-screen bg-amber-50">
      <nav className="flex items-center justify-between px-6 py-5 bg-white/80 backdrop-blur border-b border-amber-100 md:px-8">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-500 rounded-xl">
            <Utensils size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold">FoodBridge</span>
        </div>
        <div className="flex gap-3">
          {dashboardPath ? (
            <Button render={<Link to={dashboardPath} />} className="bg-orange-500 hover:bg-orange-600 text-white px-4">
              Go to Dashboard <ArrowRight size={16} />
            </Button>
          ) : (
            <>
              <Button variant="outline" render={<Link to="/login" />} className="border-orange-200 text-orange-700 hover:bg-orange-50">
                Login
              </Button>
              <Button render={<Link to="/register" />} className="bg-orange-500 hover:bg-orange-600 text-white">
                Register
              </Button>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-10 md:px-8">
        <section className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <Card className="bg-gradient-to-br from-purple-100 to-violet-50 border-purple-200">
            <CardHeader>
              <Badge variant="secondary" className="w-fit bg-white/70 text-violet-700 border-violet-200">
                Mindful Food Impact
              </Badge>
              <CardTitle className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                Achieve balance between food surplus and community need.
              </CardTitle>
              <CardDescription className="text-base text-gray-600 max-w-2xl">
                FoodBridge connects hotels and NGOs in real time, so safe surplus food reaches people quickly.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {dashboardPath ? (
                <Button render={<Link to={dashboardPath} />} className="bg-orange-500 hover:bg-orange-600 text-white px-5">
                  Continue to Dashboard <ArrowRight size={16} />
                </Button>
              ) : (
                <>
                  <Button render={<Link to="/register" />} className="bg-orange-500 hover:bg-orange-600 text-white px-5">
                    Get Started <ArrowRight size={16} />
                  </Button>
                  <Button variant="outline" render={<Link to="/login" />} className="border-orange-200 text-orange-700">
                    Sign In
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <Card size="sm" className="bg-white border-orange-100">
              <CardHeader><CardDescription>Total Hotels</CardDescription></CardHeader>
              <CardContent className="text-3xl font-bold text-gray-900">{stats.totalHotels}</CardContent>
            </Card>
            <Card size="sm" className="bg-white border-green-100">
              <CardHeader><CardDescription>Total NGOs</CardDescription></CardHeader>
              <CardContent className="text-3xl font-bold text-gray-900">{stats.totalNGOs}</CardContent>
            </Card>
            <Card size="sm" className="bg-white border-blue-100">
              <CardHeader><CardDescription>People Served</CardDescription></CardHeader>
              <CardContent className="text-3xl font-bold text-gray-900">{stats.totalPeopleServed.toLocaleString()}</CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-5">Who uses FoodBridge?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Building2,
                title: 'Hotels & Restaurants',
                tone: 'bg-orange-500',
                points: ['Post surplus food listings', 'Receive NGO requests', 'Track donation outcomes'],
              },
              {
                icon: Heart,
                title: 'NGO Organizations',
                tone: 'bg-green-600',
                points: ['Find nearby available food', 'Update pickup and served status', 'Track people served history'],
              },
              {
                icon: Shield,
                title: 'Admin Portal',
                tone: 'bg-purple-600',
                points: ['Verify users', 'Monitor all orders', 'View platform-wide dashboard stats'],
              },
            ].map(({ icon: Icon, title, tone, points }) => (
              <Card key={title} className="bg-white border-gray-200">
                <CardHeader>
                  <div className={`w-fit p-2.5 rounded-xl ${tone}`}>
                    <Icon size={18} className="text-white" />
                  </div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {points.map((point) => (
                    <p key={point} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                      {point}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
