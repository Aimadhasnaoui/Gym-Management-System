const configs = {
  active: { label: 'Active', bg: 'bg-accent-light', text: 'text-accent-fg' },
  expired: { label: 'Expired', bg: 'bg-danger-light', text: 'text-danger-fg' },
  expiring: { label: 'Expiring', bg: 'bg-expiring-light', text: 'text-expiring-fg' },
};

export default function StatusBadge({ status }) {
  const c = configs[status] || configs.active;
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}