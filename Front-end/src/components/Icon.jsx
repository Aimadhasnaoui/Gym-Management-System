const icons = {
  dashboard: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="1.5" fill={color}/>
      <rect x="11" y="2" width="7" height="7" rx="1.5" fill={color} opacity=".5"/>
      <rect x="2" y="11" width="7" height="7" rx="1.5" fill={color} opacity=".5"/>
      <rect x="11" y="11" width="7" height="7" rx="1.5" fill={color} opacity=".3"/>
    </svg>
  ),
  members: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="8" cy="7" r="3" fill={color}/>
      <circle cx="14" cy="8" r="2.5" fill={color} opacity=".5"/>
      <path d="M2 16c0-3 2.5-5 6-5s6 2 6 5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 11c2.5 0 4 1.5 4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
    </svg>
  ),
  checkin: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke={color} strokeWidth="1.5"/>
      <path d="M7 10l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plans: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="12" rx="1.5" stroke={color} strokeWidth="1.5"/>
      <path d="M7 4V3m6 1V3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 9h8M6 13h5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  logout: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M8 4H5a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M13 7l3 3-3 3M16 10H8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  add: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 4v12M4 10h12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  search: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="5" stroke={color} strokeWidth="1.5"/>
      <path d="M15 15l-2.5-2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  alert: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 3L2 17h16L10 3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 10v3M10 14.5v.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  user: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3.5" stroke={color} strokeWidth="1.5"/>
      <path d="M3 17c0-3.5 3-6 7-6s7 2.5 7 6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  check: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M4 10l5 5 7-8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  close: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M5 5l10 10M15 5L5 15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  chevron: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M7 8l3 3 3-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  calendar: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="3" y="5" width="14" height="12" rx="1.5" stroke={color} strokeWidth="1.5"/>
      <path d="M7 3v2m6-2v2M3 9h14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  clock: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.5"/>
      <path d="M10 7v3.5l2.5 1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  barbell: (size, color) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="1" y="8.5" width="3" height="3" rx="1" fill={color}/>
      <rect x="16" y="8.5" width="3" height="3" rx="1" fill={color}/>
      <rect x="3" y="7" width="2" height="6" rx="0.5" fill={color}/>
      <rect x="15" y="7" width="2" height="6" rx="0.5" fill={color}/>
      <rect x="5" y="9.25" width="10" height="1.5" rx="0.75" fill={color}/>
    </svg>
  ),
};

export default function Icon({ name, size = 16, color = 'currentColor' }) {
  const fn = icons[name];
  return fn ? fn(size, color) : null;
}
