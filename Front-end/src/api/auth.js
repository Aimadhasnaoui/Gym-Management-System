import api from './index';

export const validateActivation = (uid, token) =>
  api.get(`/auth/activation/${uid}/${encodeURIComponent(token)}`).then(r => r.data);

export const setPassword = (payload) =>
  api.post('/auth/set-password', payload).then(r => r.data);
