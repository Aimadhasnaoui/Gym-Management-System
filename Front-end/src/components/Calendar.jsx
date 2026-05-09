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
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-semibold text-primary">Attendance Calendar</span>
          {monthVisits > 0 && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent-light text-accent-fg">
              {monthVisits} visit{monthVisits !== 1 ? 's' : ''} this month
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            className="w-7 h-7 rounded-md border border-border bg-transparent cursor-pointer flex items-center justify-center text-muted hover:bg-app transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span className="text-[13px] font-semibold text-primary min-w-[120px] text-center">{MONTHS[month]} {year}</span>
          <button
            onClick={next}
            className="w-7 h-7 rounded-md border border-border bg-transparent cursor-pointer flex items-center justify-center text-muted hover:bg-app transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="px-5 pt-4 pb-5">
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[11px] font-semibold text-muted tracking-[0.04em] pb-1.5">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const isCheckin = checkinSet.has(dateStr);

            return (
              <div
                key={dateStr}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg relative border-[1.5px] ${isCheckin
                    ? 'bg-accent border-transparent'
                    : isToday
                      ? 'bg-accent-light border-accent'
                      : 'bg-transparent border-transparent'
                  }`}
              >
                <span className={`text-[13px] leading-none ${isCheckin ? 'font-bold text-white'
                    : isToday ? 'font-bold text-accent-fg'
                      : 'font-normal text-primary'
                  }`}>
                  {day}
                </span>
                {isCheckin && (
                  <div className="w-1 h-1 rounded-full bg-white/70 mt-0.5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 pt-3.5 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[3px] bg-accent" />
            <span className="text-[11.5px] text-muted">Gym visit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-[3px] bg-accent-light border-[1.5px] border-accent" />
            <span className="text-[11.5px] text-muted">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}