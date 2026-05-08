import api from './index';

export const getPlans = () => api.get('/Plan').then(r => r.data.data);
