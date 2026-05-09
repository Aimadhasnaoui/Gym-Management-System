import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';
import Avatar from './Avatar';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/members', label: 'Members', icon: 'members' },
  { path: '/checkin', label: 'Check-in', icon: 'checkin' },
  { path: '/plans', label: 'Plans', icon: 'plans' },
];

export default function Sidebar({ gymName, onLogout }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="w-[220px] shrink-0 h-screen fixed left-0 top-0 z-10 bg-sidebar flex flex-col">

      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-[#2a2a2c]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Icon name="barbell" size={16} color="#fff" />
          </div>
          <span className="text-white font-bold text-[15px] tracking-[-0.02em]">{gymName}</span>
        </div>
      </div>

      {/* Admin label */}
      <div className="px-5 pt-4 pb-2">
        <span className="text-[10px] font-semibold tracking-[0.08em] text-[#404044] uppercase">Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-1 flex flex-col gap-0.5">
        {navItems.map(item => {
          const active = pathname === item.path || (item.path === '/members' && pathname.startsWith('/members'));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg border-0 cursor-pointer text-[13.5px] w-full text-left transition-colors duration-150 font-sans ${active
                  ? 'bg-[#2a2a2c] text-white font-semibold'
                  : 'bg-transparent text-sidebar-text font-normal hover:bg-[#1f1f21]'
                }`}
            >
              <Icon name={item.icon} size={16} color={active ? 'oklch(0.62 0.17 145)' : '#a0a0a0'} />
              {item.label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
            </button>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="px-3 py-4 border-t border-[#2a2a2c]">
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <Avatar name="Admin User" size={28} />
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] font-semibold text-white truncate">Admin User</div>
            <div className="text-[11px] text-[#505054]">Administrator</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-2.5 py-2 rounded-lg border-0 bg-transparent text-[#505054] cursor-pointer text-[12.5px] w-full transition-colors hover:text-sidebar-text font-sans"
        >
          <Icon name="logout" size={14} color="currentColor" />
          Sign out
        </button>
      </div>
    </aside>
  );
}