import { useState } from 'react';
import { today } from '../data/mockData';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Calendar({ checkinDates }) {
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const checkinSet = new Set(checkinDates);
  const todayStr = today.toISOString().split('T')[0];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthVisits = checkinDates.filter(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length;

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Attendance Calendar</span>
          {monthVisits > 0 && (
            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: 'var(--accent-light)', color: 'oklch(0.42 0.14 145)' }}>
              {monthVisits} visit{monthVisits !== 1 ? 's' : ''} this month
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={prev}
            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, minWidth: 120, textAlign: 'center' }}>{MONTHS[month]} {year}</span>
          <button
            onClick={next}
            style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: '16px 20px 20px' }}>
        {/* Day-of-week headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.04em', paddingBottom: 6 }}>{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const isCheckin = checkinSet.has(dateStr);

            return (
              <div
                key={dateStr}
                style={{
                  aspectRatio: '1',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 8, position: 'relative',
                  background: isCheckin ? 'var(--accent)' : isToday ? 'var(--accent-light)' : 'transparent',
                  border: isToday && !isCheckin ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                }}
              >
                <span style={{
                  fontSize: 13, fontWeight: isCheckin || isToday ? 700 : 400,
                  color: isCheckin ? '#fff' : isToday ? 'oklch(0.42 0.14 145)' : 'var(--text-primary)',
                  lineHeight: 1,
                }}>
                  {day}
                </span>
                {isCheckin && (
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', marginTop: 2 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--accent)' }} />
            <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Gym visit</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--accent-light)', border: '1.5px solid var(--accent)' }} />
            <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
