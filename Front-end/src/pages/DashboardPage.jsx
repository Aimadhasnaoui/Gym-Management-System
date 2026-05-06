import { useNavigate } from 'react-router-dom';
import { today, fmtShort, fmtTime } from '../data/mockData';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

export default function DashboardPage({ members, checkins, setAddMemberOpen }) {
  const navigate = useNavigate();
  const in7 = new Date(today);
  in7.setDate(in7.getDate() + 7);

  const active = members.filter(m => m.status === 'active');
  const expired = members.filter(m => m.status === 'expired');
  const expiring = members.filter(m => {
    const exp = new Date(m.expiryDate);
    return m.status === 'active' && exp >= today && exp <= in7;
  });
  const todayCheckins = checkins.filter(c => c.checkedInAt.startsWith('2026-05-06'));
  const alertMembers = [
    ...expiring.map(m => ({ ...m, alertType: 'expiring' })),
    ...expired.map(m => ({ ...m, alertType: 'expired' })),
  ];

  return (
    <div style={{ padding: '32px 36px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Wednesday, May 6, 2026</p>
        </div>
        <button
          onClick={() => setAddMemberOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <Icon name="add" size={14} color="#fff" />
          Add Member
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        <StatCard label="Active Members" value={active.length} sub={`${members.length} total`} icon="members" accent />
        <StatCard label="Expired" value={expired.length} sub="memberships" icon="alert" />
        <StatCard label="Expiring Soon" value={expiring.length} sub="within 7 days" icon="calendar" />
        <StatCard label="Today's Check-ins" value={todayCheckins.length} sub="so far today" icon="checkin" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Renewal Alerts */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="alert" size={14} color="var(--warning)" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Renewal Alerts</span>
            {alertMembers.length > 0 && (
              <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: 'oklch(0.94 0.04 25)', color: 'oklch(0.50 0.15 25)' }}>
                {alertMembers.length}
              </span>
            )}
          </div>
          <div style={{ padding: '8px 0' }}>
            {alertMembers.length === 0 ? (
              <div style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>All memberships are current ✓</div>
            ) : alertMembers.map(m => (
              <div
                key={m.id}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Avatar name={m.name} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{m.alertType === 'expired' ? 'Expired' : 'Expires'} {fmtShort(m.expiryDate)}</div>
                </div>
                <StatusBadge status={m.alertType} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Check-ins */}
        <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="clock" size={14} color="var(--accent)" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Recent Check-ins</span>
            <button onClick={() => navigate('/checkin')} style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>View all →</button>
          </div>
          <div style={{ padding: '8px 0' }}>
            {checkins.slice(0, 5).map(c => {
              const member = members.find(m => m.id === c.memberId);
              if (!member) return null;
              return (
                <div
                  key={c.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <Avatar name={member.name} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{fmtShort(c.checkedInAt)} at {fmtTime(c.checkedInAt)}</div>
                  </div>
                  <span style={{ fontSize: 11, fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>{fmtTime(c.checkedInAt)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
