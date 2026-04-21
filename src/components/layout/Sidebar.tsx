import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Utensils } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

interface NavItem { label: string; path: string; icon: LucideIcon; }

interface Props { navItems: NavItem[]; accentColor: string; }

export default function Sidebar({ navItems, accentColor }: Props) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const baseLinkClass =
    'flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm">
      {/* Logo */}
      <div className={`p-6 border-b border-gray-100`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${accentColor}`}>
            <Utensils size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg leading-none">
              FoodBridge
            </h1>
            <p className="text-xs text-gray-400 capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-gray-50">
        <div className={`p-3 rounded-xl bg-gray-50`}>
          <p className="font-semibold text-gray-800 text-sm truncate">{user?.name}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          {user?.role !== 'admin' && (
            <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full ${
              user?.isVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
            }`}>
              {user?.isVerified ? '✓ Verified' : '⏳ Pending Verification'}
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${baseLinkClass} ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={`${baseLinkClass} text-red-500 hover:bg-red-50 hover:text-red-600`}
        >
          <LogOut size={18} className="shrink-0" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </aside>
  );
}