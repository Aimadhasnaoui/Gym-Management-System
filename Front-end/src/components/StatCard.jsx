import Icon from './Icon';

export default function StatCard({ label, value, sub, accent = false, icon }) {
  return (
    <div style={{
      background: accent ? 'var(--accent)' : 'var(--surface)',
      borderRadius: 12, padding: '20px 22px',
      border: accent ? 'none' : '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: accent ? 'rgba(255,255,255,0.7)' : 'var(--muted)', letterSpacing: '0.02em' }}>{label}</span>
        <span style={{ opacity: accent ? 0.8 : 0.4 }}>
          <Icon name={icon} size={15} color={accent ? '#fff' : 'var(--text-primary)'} />
        </span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: accent ? '#fff' : 'var(--text-primary)', fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: accent ? 'rgba(255,255,255,0.6)' : 'var(--muted)' }}>{sub}</div>}
    </div>
  );
}
