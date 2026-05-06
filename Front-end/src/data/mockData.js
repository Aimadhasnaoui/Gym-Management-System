export const today = new Date('2026-05-06');

export const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
export const fmtShort = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
export const fmtTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

export const PLANS = [
  { id: 'p1', name: 'Monthly Basic', durationMonths: 1, priceLabel: '$39/mo' },
  { id: 'p2', name: 'Monthly Premium', durationMonths: 1, priceLabel: '$69/mo' },
  { id: 'p3', name: 'Quarterly', durationMonths: 3, priceLabel: '$99/qtr' },
  { id: 'p4', name: 'Annual', durationMonths: 12, priceLabel: '$299/yr' },
];

export const INITIAL_MEMBERS = [
  { id: 'm1', name: 'Alex Rivera', email: 'alex@example.com', phone: '(555) 201-4321', planId: 'p2', startDate: '2026-01-15', expiryDate: '2026-05-10', status: 'active' },
  { id: 'm2', name: 'Jordan Kim', email: 'jordan@example.com', phone: '(555) 312-9876', planId: 'p4', startDate: '2026-01-01', expiryDate: '2027-01-01', status: 'active' },
  { id: 'm3', name: 'Sam Torres', email: 'sam@example.com', phone: '(555) 423-5544', planId: 'p1', startDate: '2026-04-01', expiryDate: '2026-05-01', status: 'expired' },
  { id: 'm4', name: 'Morgan Lee', email: 'morgan@example.com', phone: '(555) 534-7788', planId: 'p3', startDate: '2026-02-10', expiryDate: '2026-05-09', status: 'active' },
  { id: 'm5', name: 'Casey Patel', email: 'casey@example.com', phone: '(555) 645-2233', planId: 'p2', startDate: '2026-03-20', expiryDate: '2026-06-20', status: 'active' },
  { id: 'm6', name: 'Riley Chen', email: 'riley@example.com', phone: '(555) 756-8899', planId: 'p1', startDate: '2026-04-15', expiryDate: '2026-05-07', status: 'active' },
  { id: 'm7', name: 'Drew Martin', email: 'drew@example.com', phone: '(555) 867-1122', planId: 'p4', startDate: '2025-12-01', expiryDate: '2026-12-01', status: 'active' },
  { id: 'm8', name: 'Quinn Walsh', email: 'quinn@example.com', phone: '(555) 978-3344', planId: 'p1', startDate: '2026-03-01', expiryDate: '2026-04-01', status: 'expired' },
];

export const INITIAL_CHECKINS = [
  { id: 'c1',  memberId: 'm1', checkedInAt: '2026-05-06T09:15:00' },
  { id: 'c2',  memberId: 'm2', checkedInAt: '2026-05-06T08:30:00' },
  { id: 'c3',  memberId: 'm5', checkedInAt: '2026-05-06T10:45:00' },
  { id: 'c4',  memberId: 'm7', checkedInAt: '2026-05-06T07:00:00' },
  { id: 'c5',  memberId: 'm4', checkedInAt: '2026-05-05T17:20:00' },
  { id: 'c6',  memberId: 'm1', checkedInAt: '2026-05-05T09:00:00' },
  { id: 'c7',  memberId: 'm3', checkedInAt: '2026-05-04T11:00:00' },
  // Jordan Kim (m2) — extra history for calendar display
  { id: 'c8',  memberId: 'm2', checkedInAt: '2026-05-04T08:00:00' },
  { id: 'c9',  memberId: 'm2', checkedInAt: '2026-05-01T09:10:00' },
  { id: 'c10', memberId: 'm2', checkedInAt: '2026-04-29T08:45:00' },
  { id: 'c11', memberId: 'm2', checkedInAt: '2026-04-26T10:00:00' },
  { id: 'c12', memberId: 'm2', checkedInAt: '2026-04-23T08:30:00' },
  { id: 'c13', memberId: 'm2', checkedInAt: '2026-04-21T07:50:00' },
  { id: 'c14', memberId: 'm2', checkedInAt: '2026-04-18T09:15:00' },
  { id: 'c15', memberId: 'm2', checkedInAt: '2026-04-15T08:00:00' },
  { id: 'c16', memberId: 'm2', checkedInAt: '2026-04-12T10:30:00' },
  { id: 'c17', memberId: 'm2', checkedInAt: '2026-04-09T08:20:00' },
  { id: 'c18', memberId: 'm2', checkedInAt: '2026-04-07T07:00:00' },
  { id: 'c19', memberId: 'm2', checkedInAt: '2026-04-03T09:00:00' },
];
