import axios from './axiosInstance'

export const getUsers = () => axios.get('/admin/users').then(r => r.data)
export const getTasks = () => axios.get('/admin/tasks').then(r => r.data)
export const createTask = (payload) => axios.post('/admin/tasks', payload).then(r => r.data)
export const updateTask = (id, payload) => axios.put(`/admin/tasks/${id}`, payload).then(r => r.data)
export const deleteTask = (id) => axios.delete(`/admin/tasks/${id}`).then(r => r.data)
