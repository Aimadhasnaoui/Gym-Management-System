import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { today, fmtShort } from '../data/mockData';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import StatusBadge from '../components/StatusBadge';

const in7 = new Date(today);
in7.setDate(in7.getDate() + 7);

function getMemberStatus(m) {
  const exp = new Date(m.expiryDate);
  if (exp < today) return 'expired';
  if (exp <= in7) return 'expiring';
  return 'active';
}

export default function MembersPage({ members, plans, setAddMemberOpen }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filtered = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || m.status === filter;
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

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-muted text-[13px]">No members found</div>
        ) : filtered.map((m, idx) => {
          const plan = plans.find(p => p.id === m.planId);
          const status = getMemberStatus(m);
          return (
            <div
              key={m.id}
              onClick={() => navigate(`/members/${m.id}`)}
              className={`grid px-5 py-3.5 items-center cursor-pointer transition-colors hover:bg-[#fafaf9] ${idx < filtered.length - 1 ? 'border-b border-border' : ''
                }`}
              style={{ gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr' }}
            >
              {/* Member */}
              <div className="flex items-center gap-2.5">
                <Avatar name={m.name} size={34} />
                <div>
                  <div className="text-[13.5px] font-medium text-primary">{m.name}</div>
                  <div className="text-[11.5px] text-muted">{m.email}</div>
                </div>
              </div>

              {/* Contact */}
              <div className="text-[13px] text-secondary">{m.phone}</div>

              {/* Plan */}
              <div>
                <span className="text-[12.5px] font-medium bg-accent-light text-accent-fg px-2 py-0.5 rounded-md">
                  {plan?.name || '—'}
                </span>
              </div>

              {/* Expires */}
              <div className="text-[12.5px] font-mono text-secondary">{fmtShort(m.expiryDate)}</div>

              {/* Status */}
              <StatusBadge status={status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}