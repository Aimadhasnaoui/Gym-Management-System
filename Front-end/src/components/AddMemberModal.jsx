import { useState } from 'react';
import { PLANS } from '../data/mockData';
import Icon from './Icon';

function FieldInput({ label, field, type = 'text', placeholder, form, setForm, errors }) {
  const set = (v) => setForm(f => ({ ...f, [field]: v }));
  return (
    <div>
      <label className="text-[12px] font-semibold text-secondary block mb-1.5">{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={e => set(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-[10px] border-[1.5px] rounded-lg text-[13.5px] outline-none transition-colors bg-surface text-primary ${errors[field] ? 'border-danger' : 'border-border focus:border-accent'
          }`}
      />
      {errors[field] && <p className="text-[11.5px] text-danger mt-1">{errors[field]}</p>}
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
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl w-[460px] shadow-[0_24px_64px_rgba(0,0,0,0.15)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-bold tracking-[-0.02em] text-primary">{isEdit ? 'Edit Member' : 'Add New Member'}</h2>
            <p className="text-[12px] text-muted mt-0.5">Step {step} of 2 — {step === 1 ? 'Personal info' : 'Membership plan'}</p>
          </div>
          <button onClick={onClose} className="border-0 bg-transparent cursor-pointer text-muted">
            <Icon name="close" size={18} color="#8a8a8a" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-[3px] bg-border">
          <div
            className="h-full bg-accent transition-all duration-300 ease-in-out"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          {step === 1 ? (
            <>
              <FieldInput label="Full Name" field="name" placeholder="e.g. Jordan Smith" form={form} setForm={setForm} errors={errors} />
              <FieldInput label="Email Address" field="email" type="email" placeholder="member@email.com" form={form} setForm={setForm} errors={errors} />
              <FieldInput label="Phone Number" field="phone" placeholder="(555) 000-0000" form={form} setForm={setForm} errors={errors} />
            </>
          ) : (
            <>
              <div>
                <label className="text-[12px] font-semibold text-secondary block mb-2">Select Plan</label>
                <div className="flex flex-col gap-2">
                  {PLANS.map(plan => (
                    <label
                      key={plan.id}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-[10px] cursor-pointer border-[1.5px] transition-all ${form.planId === plan.id
                          ? 'border-accent bg-accent-light'
                          : 'border-border bg-surface'
                        }`}
                    >
                      <input
                        type="radio" name="plan" value={plan.id}
                        checked={form.planId === plan.id}
                        onChange={() => setForm(f => ({ ...f, planId: plan.id }))}
                        className="hidden"
                      />
                      <div className="flex-1">
                        <div className="text-[13.5px] font-semibold text-primary">{plan.name}</div>
                        <div className="text-[12px] text-muted">{plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''}</div>
                      </div>
                      <span className={`text-[13.5px] font-bold ${form.planId === plan.id ? 'text-accent-fg' : 'text-primary'}`}>
                        {plan.priceLabel}
                      </span>
                      {form.planId === plan.id && <Icon name="check" size={16} color="oklch(0.62 0.17 145)" />}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-secondary block mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-3 py-[10px] border border-border rounded-lg text-[13.5px] outline-none focus:border-accent transition-colors bg-surface text-primary"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-between gap-2.5">
          {step === 2
            ? <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-lg border border-border bg-transparent text-[13px] font-medium cursor-pointer text-primary">Back</button>
            : <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-border bg-transparent text-[13px] font-medium cursor-pointer text-primary">Cancel</button>
          }
          {step === 1
            ? <button onClick={handleNext} className="px-6 py-2.5 rounded-lg border-0 bg-accent text-white text-[13px] font-semibold cursor-pointer hover:bg-accent-dark transition-colors">Next →</button>
            : <button onClick={handleSubmit} className="px-6 py-2.5 rounded-lg border-0 bg-accent text-white text-[13px] font-semibold cursor-pointer hover:bg-accent-dark transition-colors">{isEdit ? 'Save Changes' : 'Add Member'}</button>
          }
        </div>
      </div>
    </div>
  );
}