import { type LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'orange' | 'green' | 'blue' | 'purple' | 'red';
  subtitle?: string;
}

const colorMap = {
  orange: 'bg-orange-50 text-orange-600 border-orange-100',
  green: 'bg-green-50 text-green-600 border-green-100',
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
  red: 'bg-red-50 text-red-600 border-red-100',
};

const iconBg = {
  orange: 'bg-orange-100 text-orange-500',
  green: 'bg-green-100 text-green-500',
  blue: 'bg-blue-100 text-blue-500',
  purple: 'bg-purple-100 text-purple-500',
  red: 'bg-red-100 text-red-500',
};

export default function StatCard({ title, value, icon: Icon, color, subtitle }: Props) {
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 shadow-sm ${colorMap[color]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 mb-1 leading-tight">{title}</p>
          <p className="text-4xl font-bold text-gray-800 leading-none tracking-tight">{value}</p>
          {subtitle && <p className="text-sm text-gray-400 mt-2 leading-tight">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl shrink-0 ${iconBg[color]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}