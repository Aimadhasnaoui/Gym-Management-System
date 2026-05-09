import api from './index';

export const getPlans = () => api.get('/Plan').then(r => r.data.data);
export const createPlan = (data) => api.post('/Plan', data).then(r => r.data.data);
export const updatePlan = (id, data) => api.put(`/Plan/${id}`, data).then(r => r.data.data);
export const deletePlan = (id) => api.delete(`/Plan/${id}`);
