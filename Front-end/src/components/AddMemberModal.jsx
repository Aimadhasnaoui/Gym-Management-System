import { useState } from 'react';
import Icon from './Icon';

function FieldInput({ label, field, type = 'text', placeholder, form, setForm, errors }) {
  return (
    <div>
      <label className="text-[12px] font-semibold text-secondary block mb-1.5">{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
        placeholder={placeholder}
        className={`w-full px-3 py-[10px] border-[1.5px] rounded-lg text-[13.5px] outline-none transition-colors bg-surface text-primary ${errors[field] ? 'border-danger' : 'border-border focus:border-accent'}`}
      />
      {errors[field] && <p className="text-[11.5px] text-danger mt-1">{errors[field]}</p>}
    </div>
  );
}

export default function AddMemberModal({ onClose, onAdd, onEdit, editingMember, plans }) {
  const isEdit = !!editingMember;

  const [form, setForm] = useState(isEdit ? {
    FullName:  editingMember.FullName,
    Email:     editingMember.Email,
    phone:     editingMember.phone,
    address:   editingMember.address || '',
    planId:    editingMember.Plan?._id || '',
    startDate: editingMember.startDate?.split('T')[0] || '',
  } : {
    FullName: '', Email: '', phone: '', address: '',
    planId: plans[0]?._id || '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors]     = useState({});
  const [step, setStep]         = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate1 = () => {
    const e = {};
    if (!form.FullName.trim())  e.FullName = 'Name is required';
    if (!form.Email.trim() || !form.Email.includes('@')) e.Email = 'Valid email required';
    if (!form.phone.trim())     e.phone = 'Phone is required';
    if (!form.address.trim())   e.address = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e = {};
    if (!form.planId)    e.planId    = 'Select a plan';
    if (!form.startDate) e.startDate = 'Start date required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate1()) setStep(2); };

  const handleSubmit = async () => {
    if (!validate2()) return;
    const plan = plans.find(p => p._id === form.planId);
    const endDate = new Date(form.startDate);
    endDate.setMonth(endDate.getMonth() + (plan?.duration || 1));

    const payload = {
      FullName:  form.FullName,
      Email:     form.Email,
      phone:     form.phone,
      address:   form.address,
      Plan:      form.planId,
      startDate: form.startDate,
      endDate:   endDate.toISOString(),
    };

    setSubmitting(true);
    setSubmitError('');
    try {
      if (isEdit) {
        await onEdit(editingMember._id, payload);
      } else {
        await onAdd(payload);
      }
      onClose();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Something went wrong');
      setSubmitting(false);
    }
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
          <div className="h-full bg-accent transition-all duration-300 ease-in-out" style={{ width: step === 1 ? '50%' : '100%' }} />
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          {step === 1 ? (
            <>
              <FieldInput label="Full Name"     field="FullName"  placeholder="e.g. Jordan Smith"   form={form} setForm={setForm} errors={errors} />
              <FieldInput label="Email Address" field="Email"     type="email" placeholder="member@email.com" form={form} setForm={setForm} errors={errors} />
              <FieldInput label="Phone Number"  field="phone"     placeholder="(555) 000-0000"       form={form} setForm={setForm} errors={errors} />
              <FieldInput label="Address"       field="address"   placeholder="123 Main St, City"   form={form} setForm={setForm} errors={errors} />
            </>
          ) : (
            <>
              <div>
                <label className="text-[12px] font-semibold text-secondary block mb-2">Select Plan</label>
                {errors.planId && <p className="text-[11.5px] text-danger mb-1">{errors.planId}</p>}
                <div className="flex flex-col gap-2">
                  {plans.map(plan => (
                    <label
                      key={plan._id}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-[10px] cursor-pointer border-[1.5px] transition-all ${form.planId === plan._id ? 'border-accent bg-accent-light' : 'border-border bg-surface'}`}
                    >
                      <input
                        type="radio" name="plan" value={plan._id}
                        checked={form.planId === plan._id}
                        onChange={() => setForm(f => ({ ...f, planId: plan._id }))}
                        className="hidden"
                      />
                      <div className="flex-1">
                        <div className="text-[13.5px] font-semibold text-primary">{plan.name}</div>
                        <div className="text-[12px] text-muted">{plan.duration} month{plan.duration > 1 ? 's' : ''}</div>
                      </div>
                      <span className={`text-[13.5px] font-bold ${form.planId === plan._id ? 'text-accent-fg' : 'text-primary'}`}>
                        ${plan.price}
                      </span>
                      {form.planId === plan._id && <Icon name="check" size={16} color="oklch(0.62 0.17 145)" />}
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
                {errors.startDate && <p className="text-[11.5px] text-danger mt-1">{errors.startDate}</p>}
              </div>
            </>
          )}

          {submitError && (
            <div className="px-3 py-2.5 rounded-lg bg-danger-light border border-danger-border text-[12.5px] text-danger-fg">
              {submitError}
            </div>
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
            : <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg border-0 bg-accent text-white text-[13px] font-semibold cursor-pointer hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Member'}
              </button>
          }
        </div>
      </div>
    </div>
  );
}
