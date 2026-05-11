import { useState, useEffect } from 'react';
import { fmt, fmtTime } from '../data/mockData';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import Calendar from '../components/Calendar';
import { useNavigate } from 'react-router-dom';
import api from '../api/index';
import { getCheckins } from '../api/checkins';

export default function MemberPortal({ memberId, onLogout }) {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [myCheckins, setMyCheckins] = useState([]);

  useEffect(() => {
    if (!memberId) return;
    Promise.all([
      api.get(`/Member/${memberId}`).then(r => r.data.data),
      getCheckins({ memberId }),
    ]).then(([m, c]) => { setMember(m); setMyCheckins(c); }).catch(console.error);
  }, [memberId]);

  if (!member) return null;

  const plan = member.Plan;
  const today = new Date();
  const daysLeft = member.endDate
    ? Math.ceil((new Date(member.endDate) - today) / (1000 * 60 * 60 * 24))
    : null;
  const isExpiring = daysLeft !== null && daysLeft <= 7;

  const checkinDates = [...new Set(myCheckins.map(c => new Date(c.CheckIn).toISOString().split('T')[0]))];

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
            onClick={() => navigate('/settings')}
            className="flex items-center gap-1.5 text-[12.5px] text-[#606066] bg-transparent border-0 cursor-pointer hover:text-sidebar-text transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5" /><path d="M10 3v1m0 12v1M3 10h1m12 0h1m-2.05-4.95-.7.7M5.75 14.25l-.7.7M14.25 14.25l.7.7M5.75 5.75l-.7-.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            Settings
          </button>
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
            <Avatar name={member.FullName} size={52} />
            <div>
              <h1 className="text-[22px] font-bold tracking-[-0.03em] text-primary">Hi, {member.FullName.split(' ')[0]} 👋</h1>
              <p className="text-[13px] text-muted mt-0.5">Welcome to your member portal</p>
            </div>
          </div>

          {/* Plan + Expiry cards */}
          <div className="grid grid-cols-2 gap-3.5 mb-5">

            {/* Plan card */}
            <div className="bg-surface rounded-xl p-5 border border-border">
              <div className="text-[11px] font-semibold text-muted tracking-[0.04em] uppercase mb-2">Current Plan</div>
              <div className="text-[18px] font-bold text-primary mb-1">{plan?.name || '—'}</div>
              <div className="text-[12.5px] text-muted">{plan ? `$${plan.price} / ${plan.duration} mo` : ''}</div>
            </div>

            {/* Expiry card — dynamic colors based on days left */}
            <div className={`rounded-xl p-5 ${isExpiring ? 'bg-danger-light border border-danger-border' : 'bg-accent border-0'}`}>
              <div className={`text-[11px] font-semibold tracking-[0.04em] uppercase mb-2 ${isExpiring ? 'text-danger-fg' : 'text-white/70'}`}>
                Expires
              </div>
              <div className={`text-[18px] font-bold mb-1 ${isExpiring ? 'text-danger-fg' : 'text-white'}`}>
                {member.endDate ? fmt(member.endDate) : '—'}
              </div>
              <div className={`text-[12.5px] ${isExpiring ? 'text-danger' : 'text-white/70'}`}>
                {daysLeft === null ? '' : daysLeft <= 0 ? 'Membership expired' : `${daysLeft} days remaining`}
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
                key={c._id}
                className={`flex items-center gap-3.5 px-5 py-3.5 ${idx < Math.min(myCheckins.length, 5) - 1 ? 'border-b border-border' : ''}`}
              >
                <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center shrink-0">
                  <Icon name="checkin" size={16} color="oklch(0.42 0.14 145)" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-primary">{fmt(c.CheckIn)}</div>
                </div>
                <span className="text-[12px] font-mono text-muted">{fmtTime(c.CheckIn)}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}