import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (email === 'admin@fitcore.com' && password === 'admin') {
        onLogin({ role: 'admin' });
        navigate('/dashboard');
      } else if (email === 'member@fitcore.com' && password === 'member') {
        onLogin({ role: 'member', memberId: 'm4' });
        navigate('/portal');
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f5f5f3' }}>
      {/* Left panel */}
      <div style={{ width: 420, background: 'var(--sidebar-bg)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px' }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="barbell" size={18} color="#fff" />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>FitCore</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.2, marginBottom: 12 }}>Welcome back.</h1>
          <p style={{ fontSize: 14, color: '#606066', lineHeight: 1.6 }}>Sign in to manage your gym — members, check-ins, and memberships in one place.</p>
        </div>
        <div style={{ background: '#1f1f22', borderRadius: 10, padding: '14px 16px', marginTop: 'auto' }}>
          <p style={{ fontSize: 11.5, color: '#505056', marginBottom: 8, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Demo credentials</p>
          <p style={{ fontSize: 12, color: '#606066', marginBottom: 4 }}>Admin: admin@fitcore.com / admin</p>
          <p style={{ fontSize: 12, color: '#606066' }}>Member: member@fitcore.com / member</p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 6 }}>Sign in to your account</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28 }}>Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 9, fontSize: 13.5, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--border)', borderRadius: 9, fontSize: 13.5, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {error && (
              <div style={{ background: 'oklch(0.96 0.03 25)', border: '1px solid oklch(0.88 0.07 25)', borderRadius: 8, padding: '10px 12px', fontSize: 12.5, color: 'oklch(0.48 0.16 25)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <Icon name="alert" size={13} color="oklch(0.48 0.16 25)" />
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '12px', borderRadius: 9, border: 'none',
                background: loading ? 'var(--accent-light)' : 'var(--accent)',
                color: loading ? 'oklch(0.40 0.14 145)' : '#fff',
                fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
