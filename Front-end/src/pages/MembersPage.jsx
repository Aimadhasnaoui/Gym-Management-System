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
    <div style={{ padding: '32px 36px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Members</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>{members.length} total members</p>
        </div>
        <button
          onClick={() => setAddMemberOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <Icon name="add" size={14} color="#fff" />
          Add Member
        </button>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
            <Icon name="search" size={15} color="var(--muted)" />
          </span>
          <input
            type="text" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--surface)', color: 'var(--text-primary)' }}
          />
        </div>
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--surface)' }}>
          {['all', 'active', 'expired'].map((f, i) => (
            <button
              key={f} onClick={() => setFilter(f)}
              style={{
                padding: '9px 14px', border: 'none',
                borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                background: filter === f ? 'var(--accent)' : 'transparent',
                color: filter === f ? '#fff' : 'var(--muted)',
                fontSize: 12.5, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize',
              }}
            >{f}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr', padding: '10px 20px', borderBottom: '1px solid var(--border)', background: '#fafaf9' }}>
          {['Member', 'Contact', 'Plan', 'Expires', 'Status'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{h}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No members found</div>
        ) : filtered.map((m, idx) => {
          const plan = plans.find(p => p.id === m.planId);
          const status = getMemberStatus(m);
          return (
            <div
              key={m.id}
              onClick={() => navigate(`/members/${m.id}`)}
              style={{
                display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 1fr',
                padding: '14px 20px', borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'center', cursor: 'pointer', transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={m.name} size={34} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{m.email}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{m.phone}</div>
              <div>
                <span style={{ fontSize: 12.5, background: 'var(--accent-light)', color: 'oklch(0.40 0.14 145)', padding: '2px 8px', borderRadius: 6, fontWeight: 500 }}>
                  {plan?.name || '—'}
                </span>
              </div>
              <div style={{ fontSize: 12.5, fontFamily: 'DM Mono, monospace', color: 'var(--text-secondary)' }}>{fmtShort(m.expiryDate)}</div>
              <StatusBadge status={status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
