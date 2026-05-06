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

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', borderRadius: 16, width: 420, boxShadow: '0 24px 64px rgba(0,0,0,0.15)', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>{initial ? 'Edit Plan' : 'New Plan'}</h2>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
            <Icon name="close" size={18} color="var(--muted)" />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Plan Name', field: 'name', placeholder: 'e.g. Monthly Basic', type: 'text' },
            { label: 'Duration (months)', field: 'durationMonths', placeholder: 'e.g. 1', type: 'number' },
            { label: 'Price Label', field: 'priceLabel', placeholder: 'e.g. $39/mo', type: 'text' },
          ].map(({ label, field, placeholder, type }) => (
            <div key={field}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>{label}</label>
              <input
                type={type}
                value={form[field]}
                onChange={e => set(field, e.target.value)}
                placeholder={placeholder}
                min={type === 'number' ? 1 : undefined}
                style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${errors[field] ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 8, fontSize: 13.5, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = errors[field] ? 'var(--danger)' : 'var(--border)'}
              />
              {errors[field] && <p style={{ fontSize: 11.5, color: 'var(--danger)', marginTop: 4 }}>{errors[field]}</p>}
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {initial ? 'Save Changes' : 'Create Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlansPage({ plans, setPlans }) {
  const [modal, setModal] = useState(null); // null | 'add' | plan object for edit

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
    <div style={{ padding: '32px 36px', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>Plans</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>{plans.length} plan{plans.length !== 1 ? 's' : ''} available</p>
        </div>
        <button
          onClick={() => setModal('add')}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <Icon name="add" size={14} color="#fff" />
          New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>No plans yet</div>
          <button
            onClick={() => setModal('add')}
            style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Create your first plan
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {plans.map(plan => (
            <div
              key={plan.id}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 2 }}>{plan.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{plan.durationMonths} month{plan.durationMonths !== 1 ? 's' : ''}</div>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'oklch(0.42 0.14 145)', letterSpacing: '-0.02em' }}>{plan.priceLabel}</span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setModal(plan)}
                  style={{ flex: 1, padding: '7px 0', borderRadius: 7, border: '1px solid var(--border)', background: 'none', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', color: 'var(--text-primary)' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan)}
                  style={{ flex: 1, padding: '7px 0', borderRadius: 7, border: '1px solid oklch(0.88 0.04 25)', background: 'oklch(0.97 0.01 25)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', color: 'oklch(0.50 0.15 25)' }}
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
  );
}
