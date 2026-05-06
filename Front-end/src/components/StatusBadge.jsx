const configs = {
  active:   { label: 'Active',   bg: 'oklch(0.92 0.06 145)', color: 'oklch(0.42 0.14 145)' },
  expired:  { label: 'Expired',  bg: 'oklch(0.94 0.04 25)',  color: 'oklch(0.50 0.15 25)'  },
  expiring: { label: 'Expiring', bg: 'oklch(0.95 0.06 60)',  color: 'oklch(0.52 0.14 60)'  },
};

export default function StatusBadge({ status }) {
  const c = configs[status] || configs.active;
  return (
    <span style={{
      display: 'inline-block', padding: '3px 8px', borderRadius: 99,
      fontSize: 11, fontWeight: 600, letterSpacing: '0.03em',
      background: c.bg, color: c.color,
    }}>
      {c.label}
    </span>
  );
}
