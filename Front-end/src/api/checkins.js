import api from './index';

// Populated MemberId comes back as { _id, FullName } — flatten it for consistent access
const normalize = c => ({
    ...c,
    MemberId: c.MemberId?._id ?? c.MemberId,
    _memberName: c.MemberId?.FullName ?? null,
});

export const getCheckins = (params) =>
    api.get('/CheckIn', { params }).then(r => r.data.data.map(normalize));

// Ownership-checked endpoint: a member may read their own history; admins anyone's.
export const getMemberCheckins = (memberId) =>
    api.get(`/CheckIn/member-check-in/${memberId}`).then(r => r.data.data.map(normalize));

export const createCheckin = (memberId) =>
    api.post('/CheckIn', { MemberId: memberId }).then(r => normalize(r.data.data));

// Admin-only. Returns { id, url, expiresAt } for the check-in display.
export const getQrCode = () => api.get('/CheckIn/qr').then(r => r.data.data);
