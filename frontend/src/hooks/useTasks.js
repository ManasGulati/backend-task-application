import { useEffect, useState, useCallback } from 'react'
import axios from '../api/axiosInstance'

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data.data.tasks || []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const create = async (payload) => {
    const res = await axios.post('/tasks', payload);
    await fetchTasks();
    return res.data;
  };

  const update = async (id, payload) => {
    const res = await axios.put(`/tasks/${id}`, payload);
    await fetchTasks();
    return res.data;
  };

  const remove = async (id) => {
    const res = await axios.delete(`/tasks/${id}`);
    await fetchTasks();
    return res.data;
  };

  return { tasks, loading, fetchTasks, create, update, remove };
}
