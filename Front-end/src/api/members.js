import api from './index';

export const getMembers = () => api.get('/Member').then(r => r.data.data);
export const createMember = (data) => api.post('/Member', data).then(r => r.data.data);
export const updateMember = (id, data) => api.put(`/Member/${id}`, data).then(r => r.data.data);
export const deleteMember = (id) => api.delete(`/Member/${id}`);
