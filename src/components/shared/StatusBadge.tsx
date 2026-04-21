const statusConfig: Record<string, { label: string; cls: string }> = {
  available: { label: 'Available', cls: 'bg-green-100 text-green-700' },
  requested: { label: 'Requested', cls: 'bg-blue-100 text-blue-700' },
  picked: { label: 'Picked Up', cls: 'bg-purple-100 text-purple-700' },
  expired: { label: 'Expired', cls: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', cls: 'bg-gray-100 text-gray-700' },
  pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-700' },
  accepted: { label: 'Accepted', cls: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700' },
  picking_up: { label: 'Picking Up', cls: 'bg-blue-100 text-blue-700' },
  served: { label: 'Served ✓', cls: 'bg-emerald-100 text-emerald-700' },
  approved: { label: 'Verified', cls: 'bg-green-100 text-green-700' },
};

export default function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || { label: status, cls: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}