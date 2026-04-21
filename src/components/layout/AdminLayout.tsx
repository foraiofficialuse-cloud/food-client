import Sidebar from './Sidebar';
import { LayoutDashboard, UserCheck, Users, ClipboardList } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Verify Users', path: '/admin/verify-users', icon: UserCheck },
  { label: 'All Users', path: '/admin/users', icon: Users },
  { label: 'All Orders', path: '/admin/orders', icon: ClipboardList },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar navItems={navItems} accentColor="bg-purple-600" />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}