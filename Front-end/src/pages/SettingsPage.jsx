import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { changePassword } from '../api/user';

export default function SettingsPage({ onLogout }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
    setSuccess(false);
    setServerError('');
  };

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required';
    if (!form.newPassword) e.newPassword = 'New password is required';
    else if (form.newPassword.length < 6) e.newPassword = 'Must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your new password';
    else if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setServerError('');
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess(true);
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-app flex flex-col">

      {/* Header */}
      <header className="bg-sidebar h-[60px] px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[7px] bg-accent flex items-center justify-center shrink-0">
            <Icon name="barbell" size={14} color="#fff" />
          </div>
          <span className="text-[14px] font-bold text-white tracking-[-0.02em]">FitCore</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/portal')}
            className="text-[13px] text-[#606066] bg-transparent border-0 cursor-pointer hover:text-sidebar-text transition-colors"
          >
            ← Back to Portal
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-[12.5px] text-[#505054] bg-transparent border-0 cursor-pointer hover:text-sidebar-text transition-colors"
          >
            <Icon name="logout" size={13} color="currentColor" />
            Sign out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-start justify-center px-8 py-12">
        <div className="w-full max-w-[460px]">

          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-[22px] font-bold tracking-[-0.03em] text-primary mb-1">Settings</h1>
            <p className="text-[13px] text-muted">Manage your account preferences</p>
          </div>

          {/* Password card */}
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <div className="text-[14px] font-semibold text-primary">Change Password</div>
              <div className="text-[12px] text-muted mt-0.5">Choose a strong password you haven't used before</div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

              {/* Current password */}
              <div>
                <label className="text-[12px] font-semibold text-secondary block mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={form.currentPassword}
                  onChange={e => set('currentPassword', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-[10px] border-[1.5px] rounded-lg text-[13.5px] outline-none bg-surface text-primary transition-colors ${errors.currentPassword ? 'border-danger' : 'border-border focus:border-accent'
                    }`}
                />
                {errors.currentPassword && <p className="text-[11.5px] text-danger mt-1">{errors.currentPassword}</p>}
              </div>

              <div className="w-full h-px bg-border" />

              {/* New password */}
              <div>
                <label className="text-[12px] font-semibold text-secondary block mb-1.5">New Password</label>
                <input
                  type="password"
                  value={form.newPassword}
                  onChange={e => set('newPassword', e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`w-full px-3.5 py-[10px] border-[1.5px] rounded-lg text-[13.5px] outline-none bg-surface text-primary transition-colors ${errors.newPassword ? 'border-danger' : 'border-border focus:border-accent'
                    }`}
                />
                {errors.newPassword && <p className="text-[11.5px] text-danger mt-1">{errors.newPassword}</p>}
              </div>

              {/* Confirm password */}
              <div>
                <label className="text-[12px] font-semibold text-secondary block mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-[10px] border-[1.5px] rounded-lg text-[13.5px] outline-none bg-surface text-primary transition-colors ${errors.confirmPassword ? 'border-danger' : 'border-border focus:border-accent'
                    }`}
                />
                {errors.confirmPassword && <p className="text-[11.5px] text-danger mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Server error */}
              {serverError && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-danger-light border border-danger-border text-[12.5px] text-danger-fg">
                  <Icon name="alert" size={13} color="oklch(0.48 0.16 25)" />
                  {serverError}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-accent-light border border-accent text-[12.5px] text-accent-fg">
                  <Icon name="check" size={13} color="oklch(0.42 0.14 145)" />
                  Password updated successfully
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-lg border-0 bg-accent text-white text-[13px] font-semibold cursor-pointer hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {saving ? 'Updating…' : 'Update Password'}
              </button>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}