import { useParams, useNavigate } from 'react-router-dom';
import { today, fmt, fmtShort, fmtTime } from '../data/mockData';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';
import Icon from '../components/Icon';

const in7 = new Date(today);
in7.setDate(in7.getDate() + 7);

function getMemberStatus(m) {
  const exp = new Date(m.expiryDate);
  if (exp < today) return 'expired';
  if (exp <= in7) return 'expiring';
  return 'active';
}

function daysRemaining(expiryDate) {
  const diff = new Date(expiryDate) - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function MemberProfilePage({ members, plans, checkins, setMembers, onEditMember }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const member = members.find(m => m.id === id);

  if (!member) {
    navigate('/members', { replace: true });
    return null;
  }

  const plan = plans.find(p => p.id === member.planId);
  const status = getMemberStatus(member);
  const days = daysRemaining(member.expiryDate);
  const memberCheckins = checkins
    .filter(c => c.memberId === member.id)
    .sort((a, b) => new Date(b.checkedInAt) - new Date(a.checkedInAt));

  const totalDays = Math.ceil(
    (new Date(member.expiryDate) - new Date(member.startDate)) / (1000 * 60 * 60 * 24)
  );
  const daysUsed = Math.ceil(
    (today - new Date(member.startDate)) / (1000 * 60 * 60 * 24)
  );
  const progressPct = Math.min(100, Math.max(0, (daysUsed / totalDays) * 100));

  function handleDelete() {
    if (!window.confirm(`Remove ${member.name} from the system?`)) return;
    setMembers(prev => prev.filter(m => m.id !== id));
    navigate('/members');
  }

  return (
    <div style={{ padding: '32px 36px', maxWidth: 860, margin: '0 auto' }}>

      {/* Back */}
      <button
        onClick={() => navigate('/members')}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 13, fontWeight: 500, marginBottom: 24, padding: 0 }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M13 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Members
      </button>

      {/* Header card */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '28px 28px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
        <Avatar name={member.name} size={64} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>{member.name}</h1>
            <StatusBadge status={status} />
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--muted)' }}>
            <span>{member.email}</span>
            <span>{member.phone}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onEditMember && onEditMember(member)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M13 3l4 4-9 9H4v-4L13 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            Edit
          </button>
          <button
            onClick={handleDelete}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1px solid oklch(0.88 0.04 25)', background: 'oklch(0.97 0.01 25)', color: 'oklch(0.50 0.15 25)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M5 7h10l-1 9H6L5 7zM3 7h14M8 7V4h4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Membership card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '22px 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 14 }}>Membership</div>

          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{plan?.name || '—'}</span>
            {plan && <span style={{ fontSize: 12.5, color: 'var(--muted)', marginLeft: 8 }}>{plan.priceLabel}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Start Date</div>
              <div style={{ fontSize: 13, fontWeight: 500, fontFamily: 'DM Mono, monospace' }}>{fmt(member.startDate)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Expiry Date</div>
              <div style={{ fontSize: 13, fontWeight: 500, fontFamily: 'DM Mono, monospace' }}>{fmt(member.expiryDate)}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>Progress</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: status === 'expired' ? 'oklch(0.50 0.15 25)' : status === 'expiring' ? 'oklch(0.52 0.14 60)' : 'oklch(0.42 0.14 145)' }}>
                {status === 'expired' ? `Expired ${Math.abs(days)} days ago` : `${days} day${days !== 1 ? 's' : ''} left`}
              </span>
            </div>
            <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 99, transition: 'width 0.3s',
                width: `${progressPct}%`,
                background: status === 'expired' ? 'oklch(0.70 0.10 25)' : status === 'expiring' ? 'oklch(0.75 0.12 60)' : 'var(--accent)',
              }} />
            </div>
          </div>
        </div>

        {/* Stats card */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '22px 24px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 14 }}>Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total check-ins</span>
              <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.04em' }}>{memberCheckins.length}</span>
            </div>
            <div style={{ width: '100%', height: 1, background: 'var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Last visit</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>
                {memberCheckins.length > 0 ? fmtShort(memberCheckins[0].checkedInAt) : '—'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Member since</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{fmtShort(member.startDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in history */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Check-in History</span>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{memberCheckins.length} visit{memberCheckins.length !== 1 ? 's' : ''}</span>
        </div>
        {memberCheckins.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No check-ins recorded</div>
        ) : (
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {memberCheckins.map((c, idx) => (
              <div
                key={c.id}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 24px', borderBottom: idx < memberCheckins.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'oklch(0.92 0.06 145)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="check" size={14} color="oklch(0.42 0.14 145)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{fmt(c.checkedInAt)}</div>
                </div>
                <div style={{ fontSize: 12.5, fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>{fmtTime(c.checkedInAt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
