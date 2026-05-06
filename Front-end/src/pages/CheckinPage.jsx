import { useState } from 'react';
import { today, fmt, fmtTime } from '../data/mockData';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';

const todayStr = '2026-05-06';

export default function CheckinPage({ members, checkins, setCheckins }) {
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState(null);

  const results = query.length > 1
    ? members.filter(m => m.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleCheckin = (member) => {
    setCheckins(prev => [{ id: 'c' + Date.now(), memberId: member.id, checkedInAt: new Date().toISOString() }, ...prev]);
    setToast(member.name);
    setQuery('');
    setTimeout(() => setToast(null), 3000);
  };

  const todayCheckins = checkins.filter(c => c.checkedInAt.startsWith(todayStr));

  return (
    <div style={{ padding: '32px 36px', maxWidth: 700, margin: '0 auto' }}>
      {toast && (
        <div style={{
          position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--text-primary)', color: '#fff',
          padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 8, zIndex: 100,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }}>
          <Icon name="check" size={16} color="oklch(0.62 0.17 145)" />
          {toast} checked in successfully
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Check-in</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Search for a member and record their visit</p>
      </div>

      {/* Search box */}
      <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '20px', borderBottom: results.length > 0 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
              <Icon name="search" size={18} color="var(--muted)" />
            </span>
            <input
              type="text" placeholder="Search member name…" value={query} onChange={e => setQuery(e.target.value)} autoFocus
              style={{ width: '100%', padding: '13px 14px 13px 44px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 15, outline: 'none', background: '#fafaf9' }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>
        {results.length > 0 && (
          <div>
            {results.map((m, idx) => {
              const expired = new Date(m.expiryDate) < today;
              return (
                <div
                  key={m.id}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: idx < results.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <Avatar name={m.name} size={40} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                      Expires {fmt(m.expiryDate)}
                      {expired && <span style={{ color: 'oklch(0.50 0.15 25)', marginLeft: 6 }}>· Membership expired</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCheckin(m)} disabled={expired}
                    style={{
                      padding: '8px 18px', borderRadius: 8, border: 'none',
                      background: expired ? '#e8e8e6' : 'var(--accent)',
                      color: expired ? 'var(--muted)' : '#fff',
                      fontSize: 13, fontWeight: 600, cursor: expired ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {expired ? 'Expired' : 'Check In'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Today's log */}
      <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="clock" size={14} color="var(--accent)" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Today's Check-ins</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--muted)', fontWeight: 500 }}>{todayCheckins.length} visits</span>
        </div>
        {todayCheckins.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No check-ins yet today</div>
        ) : todayCheckins.map((c, idx) => {
          const m = members.find(mb => mb.id === c.memberId);
          if (!m) return null;
          return (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: idx < todayCheckins.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <Avatar name={m.name} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
              </div>
              <span style={{ fontSize: 12, fontFamily: 'DM Mono, monospace', color: 'var(--muted)' }}>{fmtTime(c.checkedInAt)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
