import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fmtShort, fmtTime } from '../data/mockData';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { getMembers } from '../api/members';
import { getCheckins } from '../api/checkins';

const today = new Date();
const in7 = new Date(today);
in7.setDate(today.getDate() + 7);

function getMemberStatus(m) {
  const exp = new Date(m.endDate);
  if (exp < today) return 'expired';
  if (exp <= in7) return 'expiring';
  return 'active';
}

export default function DashboardPage({ setAddMemberOpen }) {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [checkins, setCheckins] = useState([]);

  useEffect(() => {
    Promise.all([getMembers(), getCheckins({ check: 'today' })])
      .then(([m, c]) => { setMembers(m); setCheckins(c); })
      .catch(console.error);
  }, []);

  const active   = members.filter(m => getMemberStatus(m) !== 'expired');
  const expired  = members.filter(m => getMemberStatus(m) === 'expired');
  const expiring = members.filter(m => getMemberStatus(m) === 'expiring');

  const alertMembers = [
    ...expiring.map(m => ({ ...m, alertType: 'expiring' })),
    ...expired.map(m => ({ ...m, alertType: 'expired' })),
  ];

  return (
    <div className="py-8 px-9 max-w-[960px] mx-auto">

      {/* Header */}
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-900 mb-1">Dashboard</h1>
          <p className="text-[13px] text-slate-500">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
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
        <StatCard label="Active Members"    value={active.length}        sub={`${members.length} total`} icon="members" accent />
        <StatCard label="Expired"           value={expired.length}       sub="memberships"               icon="alert" />
        <StatCard label="Expiring Soon"     value={expiring.length}      sub="within 7 days"             icon="calendar" />
        <StatCard label="Today's Check-ins" value={checkins.length}      sub="so far today"              icon="checkin" />
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
              <div className="px-5 py-6 text-center text-slate-500 text-[13px]">All memberships are current ✓</div>
            ) : alertMembers.map(m => (
              <div
                key={m._id}
                onClick={() => navigate(`/members/${m._id}`)}
                className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Avatar name={m.FullName} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate text-slate-900">{m.FullName}</div>
                  <div className="text-[11.5px] text-slate-500 mt-0.5">
                    {m.alertType === 'expired' ? 'Expired' : 'Expires'} {fmtShort(m.endDate)}
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
            <Icon name="clock" size={14} color="#2f9f3d" />
            <span className="text-[13px] font-semibold text-slate-800">Recent Check-ins</span>
            <button
              onClick={() => navigate('/checkin')}
              className="ml-auto text-[11.5px] text-accent hover:text-accent-dark font-medium transition-colors border-none bg-transparent cursor-pointer"
            >
              View all →
            </button>
          </div>
          <div className="py-2">
            {checkins.length === 0 ? (
              <div className="px-5 py-6 text-center text-slate-500 text-[13px]">No check-ins today yet</div>
            ) : checkins.slice(0, 5).map((c) => (
              <div key={c._id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 transition-colors">
                <Avatar name={c._memberName} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate text-slate-900">{c._memberName}</div>
                  <div className="text-[11.5px] text-slate-500 mt-0.5">{fmtShort(c.CheckIn)} at {fmtTime(c.CheckIn)}</div>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{fmtTime(c.CheckIn)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
