import { today, fmt, fmtTime } from '../data/mockData';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';

export default function MemberPortal({ members, checkins, plans, onLogout }) {
  const member = members.find(m => m.id === 'm2') || members[0];
  const plan = plans.find(p => p.id === member.planId);
  const myCheckins = checkins.filter(c => c.memberId === member.id).slice(0, 5);
  const daysLeft = Math.ceil((new Date(member.expiryDate) - today) / (1000 * 60 * 60 * 24));

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f3', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'var(--sidebar-bg)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="barbell" size={14} color="#fff" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>FitCore</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#606066' }}>Member Portal</span>
          <button onClick={onLogout} style={{ fontSize: 12.5, color: '#505054', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="logout" size={13} color="#505054" /> Sign out
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '40px 32px', maxWidth: 700, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar name={member.name} size={52} />
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>Hi, {member.name.split(' ')[0]} 👋</h1>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Welcome to your member portal</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 12, padding: '20px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Current Plan</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{plan?.name || '—'}</div>
            <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{plan?.priceLabel}</div>
          </div>
          <div style={{
            background: daysLeft <= 7 ? 'oklch(0.96 0.04 25)' : 'var(--accent)',
            borderRadius: 12, padding: '20px',
            border: daysLeft <= 7 ? '1px solid oklch(0.88 0.07 25)' : 'none',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: daysLeft <= 7 ? 'oklch(0.50 0.15 25)' : 'rgba(255,255,255,0.7)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Expires</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: daysLeft <= 7 ? 'oklch(0.40 0.15 25)' : '#fff', marginBottom: 4 }}>{fmt(member.expiryDate)}</div>
            <div style={{ fontSize: 12.5, color: daysLeft <= 7 ? 'oklch(0.52 0.12 25)' : 'rgba(255,255,255,0.7)' }}>
              {daysLeft <= 0 ? 'Membership expired' : `${daysLeft} days remaining`}
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Recent Visits</span>
          </div>
          {myCheckins.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No visits recorded yet</div>
          ) : myCheckins.map((c, idx) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', borderBottom: idx < myCheckins.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="checkin" size={16} color="oklch(0.42 0.14 145)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{fmt(c.checkedInAt)}</div>
              </div>
              <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>{fmtTime(c.checkedInAt)}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
