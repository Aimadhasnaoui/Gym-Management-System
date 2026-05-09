import { useState } from 'react';
import Icon from '../components/Icon';

const emptyForm = { name: '', durationMonths: '', priceLabel: '' };

function PlanModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [errors, setErrors] = useState({});

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.durationMonths || isNaN(form.durationMonths) || Number(form.durationMonths) < 1) e.durationMonths = 'Enter a valid duration';
    if (!form.priceLabel.trim()) e.priceLabel = 'Price label is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, durationMonths: Number(form.durationMonths) });
  };

  const fields = [
    { label: 'Plan Name', field: 'name', placeholder: 'e.g. Monthly Basic', type: 'text' },
    { label: 'Duration (months)', field: 'durationMonths', placeholder: 'e.g. 1', type: 'number' },
    { label: 'Price Label', field: 'priceLabel', placeholder: 'e.g. $39/mo', type: 'text' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl w-[420px] shadow-[0_24px_64px_rgba(0,0,0,0.15)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-[15px] font-bold tracking-[-0.02em] text-primary">
            {initial ? 'Edit Plan' : 'New Plan'}
          </h2>
          <button onClick={onClose} className="border-0 bg-transparent cursor-pointer">
            <Icon name="close" size={18} color="#8a8a8a" />
          </button>
        </div>

        {/* Fields */}
        <div className="p-6 flex flex-col gap-4">
          {fields.map(({ label, field, placeholder, type }) => (
            <div key={field}>
              <label className="text-[12px] font-semibold text-secondary block mb-1.5">{label}</label>
              <input
                type={type}
                value={form[field]}
                onChange={e => set(field, e.target.value)}
                placeholder={placeholder}
                min={type === 'number' ? 1 : undefined}
                className={`w-full px-3 py-[10px] border-[1.5px] rounded-lg text-[13.5px] outline-none bg-surface text-primary transition-colors ${errors[field] ? 'border-danger' : 'border-border focus:border-accent'
                  }`}
              />
              {errors[field] && <p className="text-[11.5px] text-danger mt-1">{errors[field]}</p>}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-border bg-transparent text-[13px] font-medium cursor-pointer text-primary hover:bg-app transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg border-0 bg-accent text-white text-[13px] font-semibold cursor-pointer hover:bg-accent-dark transition-colors"
          >
            {initial ? 'Save Changes' : 'Create Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlansPage({ plans, setPlans }) {
  const [modal, setModal] = useState(null);

  const handleAdd = (data) => {
    setPlans(prev => [...prev, { id: 'p' + Date.now(), ...data }]);
    setModal(null);
  };

  const handleEdit = (data) => {
    setPlans(prev => prev.map(p => p.id === modal.id ? { ...modal, ...data } : p));
    setModal(null);
  };

  const handleDelete = (plan) => {
    if (!window.confirm(`Delete plan "${plan.name}"? Members assigned to it won't be affected.`)) return;
    setPlans(prev => prev.filter(p => p.id !== plan.id));
  };

  return (
    <div className="px-9 py-8 flex flex-col justify-center items-center">
      <div className='mx-auto max-w-[860px] w-full'>
        {/* Header */}
        <div className="flex justify-between items-start mb-7">
          <div>
            <h1 className="text-[22px] font-bold tracking-[-0.03em] text-primary mb-1">Plans</h1>
            <p className="text-[13px] text-muted">{plans.length} plan{plans.length !== 1 ? 's' : ''} available</p>
          </div>
          <button
            onClick={() => setModal('add')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border-0 bg-accent text-white text-[13px] font-semibold cursor-pointer hover:bg-accent-dark transition-colors"
          >
            <Icon name="add" size={14} color="#fff" />
            New Plan
          </button>
        </div>

        {/* Empty state */}
        {plans.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl px-6 py-16 text-center">
            <div className="text-[13px] text-muted mb-3">No plans yet</div>
            <button
              onClick={() => setModal('add')}
              className="px-4 py-2.5 rounded-lg border-0 bg-accent text-white text-[13px] font-semibold cursor-pointer hover:bg-accent-dark transition-colors"
            >
              Create your first plan
            </button>
          </div>
        ) : (
          <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {plans.map(plan => (
              <div
                key={plan.id}
                className="bg-surface border border-border rounded-xl p-[20px_22px] flex flex-col gap-3.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[14.5px] font-bold text-primary mb-0.5">{plan.name}</div>
                    <div className="text-[12px] text-muted">{plan.durationMonths} month{plan.durationMonths !== 1 ? 's' : ''}</div>
                  </div>
                  <span className="text-[16px] font-bold text-accent-fg tracking-[-0.02em]">{plan.priceLabel}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setModal(plan)}
                    className="flex-1 py-[7px] rounded-lg border border-border bg-transparent text-[12.5px] font-medium cursor-pointer text-primary hover:bg-app transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan)}
                    className="flex-1 py-[7px] rounded-lg border border-danger-border bg-danger-light text-[12.5px] font-medium cursor-pointer text-danger-fg hover:bg-danger/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {modal && (
          <PlanModal
            initial={modal === 'add' ? null : modal}
            onSave={modal === 'add' ? handleAdd : handleEdit}
            onClose={() => setModal(null)}
          />
        )}
      </div>
    </div>
  );
}