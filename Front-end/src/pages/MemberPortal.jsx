import { today, fmt, fmtTime } from '../data/mockData';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import Calendar from '../components/Calendar';

export default function MemberPortal({ memberId, members, checkins, plans, onLogout }) {
  const member = members.find(m => m.id === memberId) || members[0];
  const plan = plans.find(p => p.id === member.planId);
  const myCheckins = checkins.filter(c => c.memberId === member.id);
  const daysLeft = Math.ceil((new Date(member.expiryDate) - today) / (1000 * 60 * 60 * 24));
  const isExpiring = daysLeft <= 7;

  const checkinDates = [...new Set(myCheckins.map(c => c.checkedInAt.split('T')[0]))];

  return (
    <div className="min-h-screen bg-app flex flex-col">

      {/* Header */}
      <header className="bg-sidebar h-[60px] px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[7px] bg-accent flex items-center justify-center shrink-0">
            <Icon name="barbell" size={14} color="#fff" />
          </div>
          <span className="text-[14px] font-bold text-white tracking-[-0.02em]">FitCore</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[13px] text-[#606066]">Member Portal</span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-[12.5px] text-[#505054] bg-transparent border-0 cursor-pointer hover:text-sidebar-text transition-colors"
          >
            <Icon name="logout" size={13} color="currentColor" />
            Sign out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex items-center justify-center w-full mx-auto">
        <div className="max-w-[700px] mx-auto flex-1 px-8 py-10">
          {/* Greeting */}
          <div className="flex items-center gap-4 mb-7 mx-auto">
            <Avatar name={member.name} size={52} />
            <div>
              <h1 className="text-[22px] font-bold tracking-[-0.03em] text-primary">Hi, {member.name.split(' ')[0]} 👋</h1>
              <p className="text-[13px] text-muted mt-0.5">Welcome to your member portal</p>
            </div>
          </div>

          {/* Plan + Expiry cards */}
          <div className="grid grid-cols-2 gap-3.5 mb-5">

            {/* Plan card */}
            <div className="bg-surface rounded-xl p-5 border border-border">
              <div className="text-[11px] font-semibold text-muted tracking-[0.04em] uppercase mb-2">Current Plan</div>
              <div className="text-[18px] font-bold text-primary mb-1">{plan?.name || '—'}</div>
              <div className="text-[12.5px] text-muted">{plan?.priceLabel}</div>
            </div>

            {/* Expiry card — dynamic colors based on days left */}
            <div className={`rounded-xl p-5 ${isExpiring ? 'bg-danger-light border border-danger-border' : 'bg-accent border-0'}`}>
              <div className={`text-[11px] font-semibold tracking-[0.04em] uppercase mb-2 ${isExpiring ? 'text-danger-fg' : 'text-white/70'}`}>
                Expires
              </div>
              <div className={`text-[18px] font-bold mb-1 ${isExpiring ? 'text-danger-fg' : 'text-white'}`}>
                {fmt(member.expiryDate)}
              </div>
              <div className={`text-[12.5px] ${isExpiring ? 'text-danger' : 'text-white/70'}`}>
                {daysLeft <= 0 ? 'Membership expired' : `${daysLeft} days remaining`}
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="mb-5">
            <Calendar checkinDates={checkinDates} />
          </div>

          {/* Recent Visits */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <span className="text-[13px] font-semibold text-primary">Recent Visits</span>
              <span className="text-[12px] font-mono text-muted">{myCheckins.length} total</span>
            </div>

            {myCheckins.length === 0 ? (
              <div className="px-5 py-8 text-center text-muted text-[13px]">No visits recorded yet</div>
            ) : myCheckins.slice(0, 5).map((c, idx) => (
              <div
                key={c.id}
                className={`flex items-center gap-3.5 px-5 py-3.5 ${idx < Math.min(myCheckins.length, 5) - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
                  <Icon name="checkin" size={16} color="oklch(0.42 0.14 145)" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-primary">{fmt(c.checkedInAt)}</div>
                </div>
                <span className="text-[12px] font-mono text-muted">{fmtTime(c.checkedInAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}