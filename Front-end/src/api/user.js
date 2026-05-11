import api from './index';

export const changePassword = (data) =>
    api.put('/User/change-password', data).then(r => r.data);