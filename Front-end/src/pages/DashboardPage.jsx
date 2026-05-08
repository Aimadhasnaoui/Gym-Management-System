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
    <div className="py-8 px-9 max-w-[960px] mx-auto">

      {/* Header */}
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-900 mb-1">
            Dashboard
          </h1>
          <p className="text-[13px] text-slate-500">Wednesday, May 6, 2026</p>
        </div>
        <button
          onClick={() => setAddMemberOpen(true)}
          className="flex items-center gap-1.5 px-4 py-[9px] rounded-lg bg-accent hover:bg-accent-dark text-white text-[13px] font-semibold transition-colors cursor-pointer border-none"
        >
          <Icon name="add" size={14} color="#fff" />
          Add Member
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3.5 mb-7">
        <StatCard label="Active Members" value={active.length} sub={`${members.length} total`} icon="members" accent />
        <StatCard label="Expired" value={expired.length} sub="memberships" icon="alert" />
        <StatCard label="Expiring Soon" value={expiring.length} sub="within 7 days" icon="calendar" />
        <StatCard label="Today's Check-ins" value={todayCheckins.length} sub="so far today" icon="checkin" />
      </div>

      {/* Bottom two panels */}
      <div className="grid grid-cols-2 gap-4">

        {/* Renewal Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center gap-2">
            <Icon name="alert" size={14} color="#f59e0b" />
            <span className="text-[13px] font-semibold text-slate-800">Renewal Alerts</span>
            {alertMembers.length > 0 && (
              <span className="ml-auto text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-700">
                {alertMembers.length}
              </span>
            )}
          </div>
          <div className="py-2">
            {alertMembers.length === 0 ? (
              <div className="px-5 py-6 text-center text-slate-500 text-[13px]">
                All memberships are current ✓
              </div>
            ) : alertMembers.map(m => (
              <div
                key={m.id}
                className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors cursor-default"
              >
                <Avatar name={m.name} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate text-slate-900">{m.name}</div>
                  <div className="text-[11.5px] text-slate-500 mt-0.5">
                    {m.alertType === 'expired' ? 'Expired' : 'Expires'} {fmtShort(m.expiryDate)}
                  </div>
                </div>
                <StatusBadge status={m.alertType} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Check-ins */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 flex items-center gap-2">
            <Icon name="clock" size={14} color="#4f46e5" />
            <span className="text-[13px] font-semibold text-slate-800">Recent Check-ins</span>
            <button
              onClick={() => navigate('/checkin')}
              className="ml-auto text-[11.5px] text-indigo-600 hover:text-indigo-800 font-medium transition-colors border-none bg-transparent cursor-pointer"
            >
              View all →
            </button>
          </div>
          <div className="py-2">
            {checkins.slice(0, 5).map(c => {
              const member = members.find(m => m.id === c.memberId);
              if (!member) return null;
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors cursor-default"
                >
                  <Avatar name={member.name} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate text-slate-900">{member.name}</div>
                    <div className="text-[11.5px] text-slate-500 mt-0.5">
                      {fmtShort(c.checkedInAt)} at {fmtTime(c.checkedInAt)}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {fmtTime(c.checkedInAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}