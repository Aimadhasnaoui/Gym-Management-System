export default function Avatar({ name, size = 36 }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const hue = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `oklch(0.75 0.12 ${hue})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.33, fontWeight: 600, color: '#fff',
      flexShrink: 0, fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em',
    }}>
      {initials}
    </div>
  );
}
