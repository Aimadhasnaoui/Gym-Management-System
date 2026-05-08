import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import api from '../api/index';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, data: user } = (await api.post('/Login', { email, password })).data;
      const role = user.role === 'admin' ? 'admin' : 'member';
      const authData = { role, userId: user._id, name: user.FullName };
      localStorage.setItem('token', token);
      localStorage.setItem('auth', JSON.stringify(authData));
      onLogin(authData);
      navigate(role === 'admin' ? '/dashboard' : '/portal');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-app">

      {/* Left panel */}
      <div className="w-[420px] shrink-0 h-screen flex flex-col px-11 py-9 bg-sidebar">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] bg-accent flex items-center justify-center shrink-0">
            <Icon name="barbell" size={18} color="#fff" />
          </div>
          <span className="text-[17px] font-bold text-white tracking-[-0.03em]">FitCore</span>
        </div>

        {/* Welcome copy — vertically centered */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-[28px] font-bold text-white tracking-[-0.04em] leading-snug mb-3">
            Welcome back.
          </h1>
          <p className="text-[14px] text-[#606066] leading-relaxed">
            Sign in to manage your gym — members, check-ins, and memberships in one place.
          </p>
        </div>

        {/* Demo credentials — pinned to bottom */}
        <div className="bg-[#1f1f22] rounded-[10px] px-4 py-3.5">
          <p className="text-[11px] font-semibold tracking-[0.04em] uppercase text-[#505056] mb-2">
            Demo credentials
          </p>
          <p className="text-[12px] text-[#606066] mb-1">Admin: admin@fitcore.com / admin</p>
          <p className="text-[12px] text-[#606066]">Member: member@fitcore.com / member</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-10 bg-app">
        <div className="w-full max-w-[360px]">
          <h2 className="text-[20px] font-bold tracking-[-0.03em] text-primary mb-1.5">
            Sign in to your account
          </h2>
          <p className="text-[13px] text-muted mb-7">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div>
              <label className="text-[12px] font-semibold text-secondary block mb-1.5">
                Email Address
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full px-3.5 py-[11px] border border-border rounded-[9px] text-[13.5px] text-primary bg-surface outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="text-[12px] font-semibold text-secondary block mb-1.5">
                Password
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full px-3.5 py-[11px] border border-border rounded-[9px] text-[13.5px] text-primary bg-surface outline-none focus:border-accent transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-danger-light border border-danger-border text-[12.5px] text-danger-fg">
                <Icon name="alert" size={13} color="oklch(0.48 0.16 25)" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-[9px] border-0 text-[14px] font-semibold transition-colors ${loading
                  ? 'bg-accent-light text-accent-dark cursor-not-allowed'
                  : 'bg-accent text-white cursor-pointer hover:bg-accent-dark'
                }`}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}