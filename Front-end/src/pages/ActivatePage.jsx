import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { validateActivation, setPassword } from '../api/auth';

const policyOk = (pw) =>
  pw.length >= 10 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /[0-9]/.test(pw);

export default function ActivatePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const uid = params.get('uid') || '';
  const token = params.get('token') || '';

  const [status, setStatus] = useState('checking'); // checking | valid | invalid | done
  const [name, setName] = useState('');
  const [password, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!uid || !token) { setStatus('invalid'); return; }
    validateActivation(uid, token)
      .then((res) => { setName(res.data?.name || ''); setStatus('valid'); })
      .catch(() => setStatus('invalid'));
  }, [uid, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!policyOk(password)) {
      setError('Password must be at least 10 characters and include upper, lower and a digit.');
      return;
    }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setSubmitting(true);
    try {
      await setPassword({ userId: uid, token, password });
      setStatus('done');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not set your password. The link may have expired.');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-app">
      {/* Left panel */}
      <div className="w-[420px] shrink-0 h-screen flex flex-col px-11 py-9 bg-sidebar">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] bg-accent flex items-center justify-center shrink-0">
            <Icon name="barbell" size={18} color="#fff" />
          </div>
          <span className="text-[17px] font-bold text-white tracking-[-0.03em]">FitCore</span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-[28px] font-bold text-white tracking-[-0.04em] leading-snug mb-3">
            Activate your account.
          </h1>
          <p className="text-[14px] text-[#606066] leading-relaxed">
            Choose a password to finish setting up your FitCore membership. This link is valid for 24 hours.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-10 bg-app">
        <div className="w-full max-w-[360px]">

          {status === 'checking' && (
            <p className="text-[13px] text-muted">Checking your activation link…</p>
          )}

          {status === 'invalid' && (
            <div>
              <h2 className="text-[20px] font-bold tracking-[-0.03em] text-primary mb-1.5">
                Link invalid or expired
              </h2>
              <p className="text-[13px] text-muted mb-6">
                This activation link is no longer valid. Please ask your gym admin to send a new invitation.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-[9px] border-0 text-[14px] font-semibold bg-accent text-white cursor-pointer hover:bg-accent-dark transition-colors"
              >
                Go to sign in
              </button>
            </div>
          )}

          {status === 'done' && (
            <div>
              <h2 className="text-[20px] font-bold tracking-[-0.03em] text-primary mb-1.5">
                Account activated 🎉
              </h2>
              <p className="text-[13px] text-muted">Redirecting you to sign in…</p>
            </div>
          )}

          {status === 'valid' && (
            <>
              <h2 className="text-[20px] font-bold tracking-[-0.03em] text-primary mb-1.5">
                {name ? `Welcome, ${name.split(' ')[0]}!` : 'Set your password'}
              </h2>
              <p className="text-[13px] text-muted mb-7">Choose a password to activate your account</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-[12px] font-semibold text-secondary block mb-1.5">New Password</label>
                  <input
                    type="password" value={password} onChange={e => setPw(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full px-3.5 py-[11px] border border-border rounded-[9px] text-[13.5px] text-primary bg-surface outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-secondary block mb-1.5">Confirm Password</label>
                  <input
                    type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full px-3.5 py-[11px] border border-border rounded-[9px] text-[13.5px] text-primary bg-surface outline-none focus:border-accent transition-colors"
                  />
                </div>

                <p className="text-[11.5px] text-muted leading-relaxed">
                  At least 10 characters, with an uppercase letter, a lowercase letter and a digit.
                </p>

                {error && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-danger-light border border-danger-border text-[12.5px] text-danger-fg">
                    <Icon name="alert" size={13} color="oklch(0.48 0.16 25)" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 rounded-[9px] border-0 text-[14px] font-semibold transition-colors ${submitting
                    ? 'bg-accent-light text-accent-dark cursor-not-allowed'
                    : 'bg-accent text-white cursor-pointer hover:bg-accent-dark'
                    }`}
                >
                  {submitting ? 'Activating…' : 'Activate account'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
