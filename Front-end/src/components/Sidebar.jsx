import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';
import Avatar from './Avatar';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/members',   label: 'Members',   icon: 'members'   },
  { path: '/checkin',   label: 'Check-in',  icon: 'checkin'   },
];

export default function Sidebar({ gymName, onLogout }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside style={{
      width: 220, background: 'var(--sidebar-bg)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'fixed', left: 0, top: 0,
      zIndex: 10, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #2a2a2c' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="barbell" size={16} color="#fff" />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>{gymName}</span>
        </div>
      </div>

      {/* Admin label */}
      <div style={{ padding: '16px 20px 8px' }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#404044', textTransform: 'uppercase' }}>Admin</span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 8, border: 'none',
                background: active ? '#2a2a2c' : 'transparent',
                color: active ? '#fff' : 'var(--sidebar-text)',
                cursor: 'pointer', fontSize: 13.5, fontWeight: active ? 600 : 400,
                width: '100%', textAlign: 'left', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#1f1f21'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ color: active ? 'var(--accent)' : 'inherit', opacity: active ? 1 : 0.7 }}>
                <Icon name={item.icon} size={16} color={active ? 'oklch(0.62 0.17 145)' : 'currentColor'} />
              </span>
              {item.label}
              {active && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)' }} />}
            </button>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid #2a2a2c' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px' }}>
          <Avatar name="Admin User" size={28} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin User</div>
            <div style={{ fontSize: 11, color: '#505054' }}>Administrator</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', borderRadius: 8, border: 'none',
            background: 'transparent', color: '#505054', cursor: 'pointer',
            fontSize: 12.5, width: '100%', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#a0a0a0'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#505054'; }}
        >
          <Icon name="logout" size={14} color="currentColor" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
