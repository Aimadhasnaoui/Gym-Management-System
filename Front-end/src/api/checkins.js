import api from './index';

// Populated MemberId comes back as { _id, FullName } — flatten it for consistent access
const normalize = c => ({
    ...c,
    MemberId: c.MemberId?._id ?? c.MemberId,
    _memberName: c.MemberId?.FullName ?? null,
});

export const getCheckins = (params) =>
    api.get('/CheckIn', { params }).then(r => r.data.data.map(normalize));

export const createCheckin = (memberId) =>
    api.post('/CheckIn', { MemberId: memberId }).then(r => normalize(r.data.data));
