import { useState } from 'react';
import { today, fmt, fmtTime } from '../data/mockData';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';

const todayStr = '2026-05-06';

const todayLabel = new Date(todayStr).toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
});

export default function CheckinPage({ members, checkins, setCheckins }) {
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [flashId, setFlashId] = useState(null);

  const filtered = query.length > 0
    ? members.filter(m => m.name.toLowerCase().includes(query.toLowerCase()))
    : members;

  const hasCheckedInToday = (memberId) =>
    checkins.some(c => c.memberId === memberId && c.checkedInAt.startsWith(todayStr));

  const handleCheckin = (member) => {
    setCheckins(prev => [
      { id: 'c' + Date.now(), memberId: member.id, checkedInAt: new Date().toISOString() },
      ...prev,
    ]);
    setFlashId(member.id);
    setToast(member.name);
    setTimeout(() => setFlashId(null), 700);
    setTimeout(() => setToast(null), 3000);
  };

  const todayCheckins = checkins.filter(c => c.checkedInAt.startsWith(todayStr));

  return (
    <div className="bg-app flex flex-col ">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-primary text-white text-[13px] font-semibold rounded-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
          <span className="w-[7px] h-[7px] rounded-full bg-green-400 shrink-0" />
          {toast} checked in
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-start justify-between px-9 pt-7 flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.03em] text-primary leading-none">Check-in</h1>
          <div className="flex items-center gap-1.5 mt-2 bg-surface border border-border rounded-full px-3 py-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
            <span className="text-[12px] font-mono text-muted">{todayLabel}</span>
          </div>
        </div>
        <div className="flex gap-2.5">
          <div className="bg-surface border border-border rounded-[10px] px-4 py-2.5 text-center">
            <div className="text-[22px] font-bold text-primary leading-none">{todayCheckins.length}</div>
            <div className="text-[11px] text-muted uppercase tracking-[0.05em] mt-0.5">Today</div>
          </div>
          <div className="bg-surface border border-border rounded-[10px] px-4 py-2.5 text-center">
            <div className="text-[22px] font-bold text-primary leading-none">{members.length}</div>
            <div className="text-[11px] text-muted uppercase tracking-[0.05em] mt-0.5">Members</div>
          </div>
        </div>
      </div>

      {/* Search / filter */}
      <div className="px-9 pt-5">
        <div className="flex items-center gap-2.5 bg-surface border border-border rounded-xl px-4 py-3 focus-within:border-accent transition-colors">
          <Icon name="search" size={15} color="#8a8a8a" />
          <input
            type="text"
            placeholder="Filter members…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="flex-1 border-0 bg-transparent text-[14px] text-primary outline-none placeholder:text-muted"
          />
          <span className="text-[12px] font-mono text-muted shrink-0">{filtered.length} / {members.length}</span>
        </div>
      </div>

      {/* Body — grid + log */}
      <div className="grid grid-cols-[1fr_280px] gap-5 px-9 pt-5 pb-9 flex-1 items-start">

        {/* Member grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(165px,1fr))] gap-2.5">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted text-[14px]">
              No members match "{query}"
            </div>
          ) : filtered.map((m, i) => {
            const expired = new Date(m.expiryDate) < today;
            const alreadyIn = hasCheckedInToday(m.id);
            const isFlashing = flashId === m.id;

            return (
              <div
                key={m.id}
                className={`bg-surface border rounded-xl px-3.5 pt-[18px] pb-3.5 flex flex-col items-center gap-2.5 transition-all ${isFlashing ? 'border-green-300 bg-green-50'
                    : alreadyIn ? 'border-green-200 bg-green-50/60'
                      : 'border-border hover:border-[#d0cdc8] hover:shadow-sm'
                  } ${expired ? 'opacity-45' : ''}`}
                style={{ animationDelay: `${Math.min(i * 25, 250)}ms` }}
              >
                <Avatar name={m.name} size={42} />
                <div className="w-full text-center">
                  <div className="text-[13px] font-semibold text-primary truncate">{m.name}</div>
                  <div className={`text-[10.5px] font-mono mt-0.5 ${expired ? 'text-danger' : 'text-muted'}`}>
                    {expired ? '· expired ·' : `exp. ${fmt(m.expiryDate)}`}
                  </div>
                </div>
                {alreadyIn ? (
                  <button className="w-full py-2 rounded-lg border-0 bg-green-100 text-green-700 text-[12px] font-semibold cursor-default">
                    ✓ Checked in
                  </button>
                ) : expired ? (
                  <button className="w-full py-2 rounded-lg border-0 bg-app text-muted text-[12px] font-semibold cursor-not-allowed" disabled>
                    Expired
                  </button>
                ) : (
                  <button
                    onClick={() => handleCheckin(m)}
                    className="w-full py-2 rounded-lg border-0 bg-primary text-white text-[12px] font-semibold cursor-pointer hover:bg-[#333] transition-colors"
                  >
                    Check In
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Today's log */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden sticky top-5">
          <div className="px-[18px] py-3.5 border-b border-border flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">Today's Log</span>
            <span className="bg-app rounded-full px-2.5 py-0.5 text-[12px] font-mono text-muted">{todayCheckins.length}</span>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {todayCheckins.length === 0 ? (
              <div className="px-[18px] py-9 text-center text-muted text-[13px]">No visits yet</div>
            ) : todayCheckins.map((c, idx) => {
              const m = members.find(mb => mb.id === c.memberId);
              if (!m) return null;
              return (
                <div
                  key={c.id}
                  className={`flex items-center gap-2.5 px-[18px] py-2.5 ${idx === 0 ? 'animate-fade-up' : ''} ${idx < todayCheckins.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <Avatar name={m.name} size={26} />
                  <span className="flex-1 text-[13px] font-medium text-primary truncate">{m.name}</span>
                  <span className="text-[11px] font-mono text-muted shrink-0">{fmtTime(c.checkedInAt)}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}