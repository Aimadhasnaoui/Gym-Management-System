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
  return Math.ceil((new Date(expiryDate) - today) / (1000 * 60 * 60 * 24));
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

  const totalDays = Math.ceil((new Date(member.expiryDate) - new Date(member.startDate)) / (1000 * 60 * 60 * 24));
  const daysUsed = Math.ceil((today - new Date(member.startDate)) / (1000 * 60 * 60 * 24));
  const progressPct = Math.min(100, Math.max(0, (daysUsed / totalDays) * 100));

  const progressColor =
    status === 'expired' ? 'bg-danger/70' :
      status === 'expiring' ? 'bg-warning' : 'bg-accent';

  const progressLabel =
    status === 'expired'
      ? `Expired ${Math.abs(days)} days ago`
      : `${days} day${days !== 1 ? 's' : ''} left`;

  const progressLabelColor =
    status === 'expired' ? 'text-danger-fg' :
      status === 'expiring' ? 'text-expiring-fg' : 'text-accent-fg';

  function handleDelete() {
    if (!window.confirm(`Remove ${member.name} from the system?`)) return;
    setMembers(prev => prev.filter(m => m.id !== id));
    navigate('/members');
  }

  return (
    <div className="px-9 py-8 max-w-[860px] mx-auto">

      {/* Back */}
      <button
        onClick={() => navigate('/members')}
        className="flex items-center gap-1.5 bg-transparent border-0 cursor-pointer text-muted text-[13px] font-medium mb-6 p-0 hover:text-primary transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M13 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Members
      </button>

      {/* Header card */}
      <div className="bg-surface border border-border rounded-xl p-7 mb-4 flex items-center gap-5">
        <Avatar name={member.name} size={64} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-[20px] font-bold tracking-[-0.03em] text-primary m-0">{member.name}</h1>
            <StatusBadge status={status} />
          </div>
          <div className="flex gap-5 text-[13px] text-muted">
            <span>{member.email}</span>
            <span>{member.phone}</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onEditMember && onEditMember(member)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-surface text-primary text-[13px] font-medium cursor-pointer hover:bg-app transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M13 3l4 4-9 9H4v-4L13 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-danger-border bg-danger-light text-danger-fg text-[13px] font-medium cursor-pointer hover:bg-danger/10 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M5 7h10l-1 9H6L5 7zM3 7h14M8 7V4h4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Middle cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Membership card */}
        <div className="bg-surface border border-border rounded-xl px-6 py-[22px]">
          <div className="text-[11px] font-semibold text-muted tracking-[0.04em] uppercase mb-3.5">Membership</div>

          <div className="mb-4">
            <span className="text-[15px] font-semibold text-primary">{plan?.name || '—'}</span>
            {plan && <span className="text-[12.5px] text-muted ml-2">{plan.priceLabel}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="text-[11px] text-muted mb-0.5">Start Date</div>
              <div className="text-[13px] font-medium font-mono text-primary">{fmt(member.startDate)}</div>
            </div>
            <div>
              <div className="text-[11px] text-muted mb-0.5">Expiry Date</div>
              <div className="text-[13px] font-medium font-mono text-primary">{fmt(member.expiryDate)}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[11px] text-muted">Progress</span>
              <span className={`text-[11px] font-semibold ${progressLabelColor}`}>{progressLabel}</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Activity card */}
        <div className="bg-surface border border-border rounded-xl px-6 py-[22px]">
          <div className="text-[11px] font-semibold text-muted tracking-[0.04em] uppercase mb-3.5">Activity</div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-muted">Total check-ins</span>
              <span className="text-[22px] font-bold tracking-[-0.04em] text-primary">{memberCheckins.length}</span>
            </div>
            <div className="w-full h-px bg-border" />
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-muted">Last visit</span>
              <span className="text-[13px] font-medium text-primary">
                {memberCheckins.length > 0 ? fmtShort(memberCheckins[0].checkedInAt) : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-muted">Member since</span>
              <span className="text-[13px] font-medium text-primary">{fmtShort(member.startDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in history */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between items-center">
          <span className="text-[13px] font-semibold text-primary">Check-in History</span>
          <span className="text-[12px] text-muted">{memberCheckins.length} visit{memberCheckins.length !== 1 ? 's' : ''}</span>
        </div>
        {memberCheckins.length === 0 ? (
          <div className="px-6 py-10 text-center text-muted text-[13px]">No check-ins recorded</div>
        ) : (
          <div className="max-h-[320px] overflow-y-auto">
            {memberCheckins.map((c, idx) => (
              <div
                key={c.id}
                className={`flex items-center gap-3 px-6 py-3 ${idx < memberCheckins.length - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="w-[30px] h-[30px] rounded-full bg-accent-light flex items-center justify-center shrink-0">
                  <Icon name="check" size={14} color="oklch(0.42 0.14 145)" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-primary">{fmt(c.checkedInAt)}</div>
                </div>
                <div className="text-[12.5px] font-mono text-muted">{fmtTime(c.checkedInAt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}