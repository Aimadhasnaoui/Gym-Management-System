import { useState } from 'react';
import { fmt, fmtTime } from '../data/mockData';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import { createCheckin } from '../api/checkins';

const today = new Date();
const todayStr = today.toDateString();
const todayLabel = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

export default function CheckinPage({ members, checkins, onCheckin }) {
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [flashId, setFlashId] = useState(null);
  const [tab, setTab] = useState('checkin'); // 'checkin' | 'log'

  const filtered = query.length > 0
    ? members.filter(m => m.FullName.toLowerCase().includes(query.toLowerCase()))
    : members;

  const hasCheckedInToday = (memberId) =>
    checkins.some(c => {
      const id = c.MemberId || c.memberId;
      const ts = c.CheckIn || c.checkedInAt;
      return id === memberId && new Date(ts).toDateString() === todayStr;
    });

  const handleCheckin = async (member) => {
    try {
      const newCheckin = await createCheckin(member._id);
      onCheckin(newCheckin);
      setFlashId(member._id);
      setToast(member.FullName);
      setTimeout(() => setFlashId(null), 700);
      setTimeout(() => setToast(null), 3000);
    } catch {
      // silently ignore
    }
  };

  const todayCheckins = checkins.filter(c => {
    const ts = c.CheckIn || c.checkedInAt;
    return new Date(ts).toDateString() === todayStr;
  });

  return (
    <div className="bg-app flex flex-col min-h-screen">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-5 py-3 bg-primary text-white text-[13px] font-semibold rounded-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
          <span className="w-[7px] h-[7px] rounded-full bg-green-400 shrink-0" />
          {toast} checked in
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-start justify-between px-9 pt-7 pb-0 flex-wrap gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.03em] text-primary leading-none">Check-in</h1>
          <div className="flex items-center gap-1.5 mt-2 bg-surface border border-border rounded-full px-3 py-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
            <span className="text-[12px] font-mono text-muted">{todayLabel}</span>
          </div>
        </div>
        <div className="flex gap-2.5">
          <div className="bg-surface border border-border rounded-[10px] px-4 py-2.5 text-center min-w-[64px]">
            <div className="text-[22px] font-bold text-primary leading-none">{todayCheckins.length}</div>
            <div className="text-[11px] text-muted uppercase tracking-[0.05em] mt-0.5">Today</div>
          </div>
          <div className="bg-surface border border-border rounded-[10px] px-4 py-2.5 text-center min-w-[64px]">
            <div className="text-[22px] font-bold text-primary leading-none">{members.length}</div>
            <div className="text-[11px] text-muted uppercase tracking-[0.05em] mt-0.5">Members</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-9 pt-6">
        <div className="flex gap-0 bg-surface border border-border rounded-xl p-1 w-fit">
          <button
            onClick={() => setTab('checkin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold border-0 cursor-pointer transition-all ${tab === 'checkin'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-transparent text-muted hover:text-primary'
              }`}
          >
            <Icon name="checkin" size={14} color={tab === 'checkin' ? '#fff' : '#8a8a8a'} />
            Check In Members
          </button>
          <button
            onClick={() => setTab('log')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold border-0 cursor-pointer transition-all ${tab === 'log'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-transparent text-muted hover:text-primary'
              }`}
          >
            <Icon name="clock" size={14} color={tab === 'log' ? '#fff' : '#8a8a8a'} />
            Today's Log
            {todayCheckins.length > 0 && (
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${tab === 'log' ? 'bg-white/20 text-white' : 'bg-accent-light text-accent-fg'
                }`}>
                {todayCheckins.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="px-9 pt-5 pb-9 flex-1">

        {/* ── Tab: Check In Members ── */}
        {tab === 'checkin' && (
          <>
            {/* Search filter */}
            <div className="flex items-center gap-2.5 bg-surface border border-border rounded-xl px-4 py-3 focus-within:border-accent transition-colors mb-5">
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

            {/* Member grid */}
            <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))' }}>
              {filtered.length === 0 ? (
                <div className="col-span-full py-16 text-center text-muted text-[14px]">No members match "{query}"</div>
              ) : filtered.map((m, i) => {
                const expired = new Date(m.endDate) < today;
                const alreadyIn = hasCheckedInToday(m._id);
                const isFlashing = flashId === m._id;

                return (
                  <div
                    key={m._id}
                    className={`bg-surface border rounded-xl px-3.5 pt-[18px] pb-3.5 flex flex-col items-center gap-2.5 transition-all ${isFlashing ? 'border-green-300 bg-green-50' :
                        alreadyIn ? 'border-green-200 bg-green-50/60' :
                          'border-border hover:border-[#d0cdc8] hover:shadow-sm'
                      } ${expired ? 'opacity-45' : ''}`}
                    style={{ animationDelay: `${Math.min(i * 25, 250)}ms` }}
                  >
                    <Avatar name={m.FullName} size={42} />
                    <div className="w-full text-center">
                      <div className="text-[13px] font-semibold text-primary truncate">{m.FullName}</div>
                      <div className={`text-[10.5px] font-mono mt-0.5 ${expired ? 'text-danger' : 'text-muted'}`}>
                        {expired ? '· expired ·' : `exp. ${fmt(m.endDate)}`}
                      </div>
                    </div>
                    {alreadyIn ? (
                      <button className="w-full py-2 rounded-lg border-0 bg-green-100 text-green-700 text-[12px] font-semibold cursor-default">✓ Checked in</button>
                    ) : expired ? (
                      <button className="w-full py-2 rounded-lg border-0 bg-app text-muted text-[12px] font-semibold cursor-not-allowed" disabled>Expired</button>
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
          </>
        )}

        {/* ── Tab: Today's Log ── */}
        {tab === 'log' && (
          <div className="bg-surface border border-border rounded-xl overflow-hidden max-w-[680px] mx-auto">

            {/* Log header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-[#fafaf9]">
              <div>
                <div className="text-[14px] font-semibold text-primary">Today's Check-ins</div>
                <div className="text-[12px] text-muted mt-0.5">{todayLabel}</div>
              </div>
              <span className="text-[13px] font-mono font-semibold text-accent bg-accent-light px-3 py-1 rounded-full">
                {todayCheckins.length} visit{todayCheckins.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Log rows */}
            {todayCheckins.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="text-[32px] mb-3">👟</div>
                <div className="text-[14px] font-medium text-primary mb-1">No check-ins yet</div>
                <div className="text-[13px] text-muted">Members checked in today will appear here</div>
              </div>
            ) : (
              <div>
                {todayCheckins.map((c, idx) => {
                  const memberId = c.MemberId || c.memberId;
                  const ts = c.CheckIn || c.checkedInAt;
                  const m = members.find(mb => mb._id === memberId || mb.id === memberId);
                  if (!m) return null;
                  return (
                    <div
                      key={c._id || c.id || idx}
                      className={`flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-[#fafaf9] ${idx < todayCheckins.length - 1 ? 'border-b border-border' : ''
                        } ${idx === 0 ? 'animate-fade-up' : ''}`}
                    >
                      {/* Index */}
                      <span className="text-[12px] font-mono text-muted w-5 shrink-0 text-right">{idx + 1}</span>

                      {/* Avatar */}
                      <Avatar name={m.FullName} size={36} />

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] font-semibold text-primary truncate">{m.FullName}</div>
                      </div>

                      {/* Time badge */}
                      <div className="flex items-center gap-1.5 bg-app border border-border rounded-lg px-3 py-1.5 shrink-0">
                        <Icon name="clock" size={12} color="#8a8a8a" />
                        <span className="text-[12px] font-mono text-muted">{fmtTime(ts)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}