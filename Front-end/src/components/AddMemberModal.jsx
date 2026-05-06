import { useState } from 'react';
import { PLANS } from '../data/mockData';
import Icon from './Icon';

function FieldInput({ label, field, type = 'text', placeholder, form, setForm, errors }) {
  const set = (v) => setForm(f => ({ ...f, [field]: v }));
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={e => set(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 12px',
          border: `1.5px solid ${errors[field] ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 8,
          fontSize: 13.5, outline: 'none',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = errors[field] ? 'var(--danger)' : 'var(--border)'}
      />
      {errors[field] && <p style={{ fontSize: 11.5, color: 'var(--danger)', marginTop: 4 }}>{errors[field]}</p>}
    </div>
  );
}

export default function AddMemberModal({ onClose, onAdd, onEdit, editingMember }) {
  const isEdit = !!editingMember;
  const [form, setForm] = useState(
    isEdit
      ? { name: editingMember.name, email: editingMember.email, phone: editingMember.phone, planId: editingMember.planId, startDate: editingMember.startDate }
      : { name: '', email: '', phone: '', planId: 'p1', startDate: '2026-05-06' }
  );
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const validate1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'Valid email required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e = {};
    if (!form.planId) e.planId = 'Select a plan';
    if (!form.startDate) e.startDate = 'Start date required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate1()) setStep(2); };

  const handleSubmit = () => {
    if (!validate2()) return;
    const plan = PLANS.find(p => p.id === form.planId);
    const start = new Date(form.startDate);
    const expiry = new Date(start);
    expiry.setMonth(expiry.getMonth() + (plan?.durationMonths || 1));
    const expiryDate = expiry.toISOString().split('T')[0];
    if (isEdit) {
      onEdit({ ...editingMember, ...form, expiryDate, status: new Date(expiryDate) < new Date() ? 'expired' : 'active' });
    } else {
      onAdd({ id: 'm' + Date.now(), ...form, expiryDate, status: 'active' });
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, width: 460, boxShadow: '0 24px 64px rgba(0,0,0,0.15)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>{isEdit ? 'Edit Member' : 'Add New Member'}</h2>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Step {step} of 2 — {step === 1 ? 'Personal info' : 'Membership plan'}</p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted)' }}>
            <Icon name="close" size={18} color="var(--muted)" />
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--border)' }}>
          <div style={{ height: '100%', width: step === 1 ? '50%' : '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }} />
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {step === 1 ? (
            <>
              <FieldInput label="Full Name" field="name" placeholder="e.g. Jordan Smith" form={form} setForm={setForm} errors={errors} />
              <FieldInput label="Email Address" field="email" type="email" placeholder="member@email.com" form={form} setForm={setForm} errors={errors} />
              <FieldInput label="Phone Number" field="phone" placeholder="(555) 000-0000" form={form} setForm={setForm} errors={errors} />
            </>
          ) : (
            <>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Select Plan</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PLANS.map(plan => (
                    <label
                      key={plan.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                        border: `1.5px solid ${form.planId === plan.id ? 'var(--accent)' : 'var(--border)'}`,
                        background: form.planId === plan.id ? 'var(--accent-light)' : '#fff',
                        transition: 'all 0.15s',
                      }}
                    >
                      <input type="radio" name="plan" value={plan.id} checked={form.planId === plan.id} onChange={() => setForm(f => ({ ...f, planId: plan.id }))} style={{ display: 'none' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{plan.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''}</div>
                      </div>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: form.planId === plan.id ? 'oklch(0.40 0.14 145)' : 'var(--text-primary)' }}>{plan.priceLabel}</span>
                      {form.planId === plan.id && <Icon name="check" size={16} color="var(--accent)" />}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          {step === 2
            ? <button onClick={() => setStep(1)} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Back</button>
            : <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
          }
          {step === 1
            ? <button onClick={handleNext} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Next →</button>
            : <button onClick={handleSubmit} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{isEdit ? 'Save Changes' : 'Add Member'}</button>
          }
        </div>
      </div>
    </div>
  );
}
