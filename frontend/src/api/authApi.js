import axios from './axiosInstance';

export const login = (payload) => axios.post('/auth/login', payload).then(res => res.data);
export const register = (payload) => axios.post('/auth/register', payload).then(res => res.data);
export const refresh = (refreshToken) => axios.post('/auth/refresh-token', { refreshToken }).then(res => res.data);
export const logout = (refreshToken) => axios.post('/auth/logout', { refreshToken }).then(res => res.data);
