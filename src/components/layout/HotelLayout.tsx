import Sidebar from './Sidebar';
import { LayoutDashboard, PlusCircle, List, Bell } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/hotel/dashboard', icon: LayoutDashboard },
  { label: 'Upload Food', path: '/hotel/upload-food', icon: PlusCircle },
  { label: 'My Listings', path: '/hotel/my-listings', icon: List },
  { label: 'NGO Requests', path: '/hotel/requests', icon: Bell },
];

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar navItems={navItems} accentColor="bg-orange-500" />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}