import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fmtShort } from '../data/mockData';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';

const today = new Date();
const in7 = new Date(today);
in7.setDate(today.getDate() + 7);

function getMemberStatus(m) {
  const exp = new Date(m.endDate);
  if (exp < today) return 'expired';
  if (exp <= in7) return 'expiring';
  return 'active';
}

export default function MembersPage({ members, setAddMemberOpen }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filtered = members.filter(m => {
    const status = getMemberStatus(m);
    const matchSearch =
      m.FullName.toLowerCase().includes(search.toLowerCase()) ||
      m.Email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'active' && status !== 'expired') ||
      (filter === 'expired' && status === 'expired');
    return matchSearch && matchFilter;
  });

  return (
    <div className="px-9 py-8 max-w-[960px] mx-auto">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.03em] text-primary mb-1">Members</h1>
          <p className="text-[13px] text-muted">{members.length} total members</p>
        </div>
        <button
          onClick={() => setAddMemberOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border-0 bg-accent text-white text-[13px] font-semibold cursor-pointer hover:bg-accent-dark transition-colors"
        >
          <Icon name="add" size={14} color="#fff" />
          Add Member
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2.5 mb-5">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon name="search" size={15} color="#8a8a8a" />
          </span>
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-[9px] border border-border rounded-lg text-[13px] outline-none bg-surface text-primary focus:border-accent transition-colors"
          />
        </div>
        <div className="flex border border-border rounded-lg overflow-hidden bg-surface">
          {['all', 'active', 'expired'].map((f, i) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-[9px] border-0 text-[12.5px] font-medium cursor-pointer capitalize transition-colors ${i > 0 ? 'border-l border-border' : ''
                } ${filter === f ? 'bg-accent text-white' : 'bg-transparent text-muted hover:text-primary'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">

        {/* Table header */}
        <div
          className="grid px-5 py-2.5 border-b border-border bg-[#fafaf9]"
          style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr' }}
        >
          {['Member', 'Contact', 'Plan', 'Expires', 'Status'].map(h => (
            <span key={h} className="text-[11px] font-semibold text-muted tracking-[0.04em] uppercase">{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-muted text-[13px]">No members found</div>
        ) : filtered.map((m, idx) => {
          const status = getMemberStatus(m);
          return (
            <div
              key={m._id}
              onClick={() => navigate(`/members/${m._id}`)}
              className={`grid px-5 py-3.5 items-center cursor-pointer transition-colors hover:bg-[#fafaf9] ${idx < filtered.length - 1 ? 'border-b border-border' : ''}`}
              style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr' }}
            >
              <div className="flex items-center gap-2.5">
                <Avatar name={m.FullName} size={34} />
                <div>
                  <div className="text-[13.5px] font-medium text-primary">{m.FullName}</div>
                  <div className="text-[11.5px] text-muted">{m.Email}</div>
                </div>
              </div>
              <div className="text-[13px] text-secondary">{m.phone}</div>
              <div>
                <span className="text-[12.5px] font-medium bg-accent-light text-accent-fg px-2 py-0.5 rounded-md">
                  {m.Plan?.name || '—'}
                </span>
              </div>
              <div className="text-[12.5px] font-mono text-secondary">{fmtShort(m.endDate)}</div>
              <StatusBadge status={status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
