import Sidebar from './Sidebar';
import { LayoutDashboard, Search, ClipboardList, Heart } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/ngo/dashboard', icon: LayoutDashboard },
  { label: 'Available Food', path: '/ngo/available-food', icon: Search },
  { label: 'My Requests', path: '/ngo/my-requests', icon: ClipboardList },
  { label: 'Food Served', path: '/ngo/food-served', icon: Heart },
];

export default function NGOLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar navItems={navItems} accentColor="bg-green-600" />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}